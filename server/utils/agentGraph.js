const { StateGraph, END, START, Annotation } = require("@langchain/langgraph");
const { decideTool: gptDecideTool, generateFinalAnswer: gptGenerateAnswer } = require("./gptHelper");
const { queryPinecone } = require("./pinecone");
const { tavilySearch } = require("./tavily");

// Define State using Annotation
const AgentState = Annotation.Root({
    userQuery: Annotation(),
    userId: Annotation(),
    context: Annotation(),
    decision: Annotation(),
    finalAnswer: Annotation(),
    sources: Annotation()
});

// Nodes
const decideToolNode = async (state) => {
    const decision = await gptDecideTool(state.userQuery);
    return { decision };
};

const searchDocumentsNode = async (state) => {
    const { userId, decision } = state;
    const query = decision.query || state.userQuery;
    
    try {
        const result = await queryPinecone({ userId, query });
        let contextText = "";
        
        if (result && result.matches && result.matches.length > 0) {
             contextText = result.matches.map(m => m.metadata.text).join("\n");
        }
        
        return { 
            context: contextText,
            sources: ["document"]
        };
    } catch (error) {
        console.error("Error in searchDocumentsNode:", error);
        return { context: "", sources: [] };
    }
};

const searchWebNode = async (state) => {
    const query = state.decision.query || state.userQuery;
    try {
        const contextText = await tavilySearch(query);
        return { 
            context: contextText,
            sources: ["web"]
        };
    } catch (error) {
        console.error("Error in searchWebNode:", error);
        return { context: "", sources: [] };
    }
};

const generateAnswerNode = async (state) => {
    try {
        const answer = await gptGenerateAnswer(state.context, state.userQuery);
        return { finalAnswer: answer };
    } catch (error) {
        console.error("Error in generateAnswerNode:", error);
        return { finalAnswer: "Sorry, I encountered an error generating the response." };
    }
};

// Edge logic
const routeTool = (state) => {
    const action = state.decision?.action;
    if (action === "search_documents") return "search_documents";
    if (action === "search_web") return "search_web";
    return "generate_answer"; // direct answer or fallback
};

// Build Graph
const workflow = new StateGraph(AgentState)
    .addNode("decide_tool", decideToolNode)
    .addNode("search_documents", searchDocumentsNode)
    .addNode("search_web", searchWebNode)
    .addNode("generate_answer", generateAnswerNode)
    
    .addEdge(START, "decide_tool")
    .addConditionalEdges("decide_tool", routeTool, {
        "search_documents": "search_documents",
        "search_web": "search_web",
        "generate_answer": "generate_answer"
    })
    .addEdge("search_documents", "generate_answer")
    .addEdge("search_web", "generate_answer")
    .addEdge("generate_answer", END);

const graph = workflow.compile();

module.exports = { graph };
