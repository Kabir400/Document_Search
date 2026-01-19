const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");
const { z } = require("zod");
const { PromptTemplate } = require("@langchain/core/prompts");
const { StringOutputParser } = require("@langchain/core/output_parsers");

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  apiKey: process.env.GEMINI_API_KEY,
  temperature: 0,
});

const decisionSchema = z.object({
  action: z
    .enum(["answer_directly", "search_documents", "search_web"])
    .describe("The action to take based on the user's message"),
  query: z
    .string()
    .optional()
    .describe(
      "The search query to use if the action is search_documents or search_web"
    ),
});

const decideTool = async (userMessage) => {
  try {
    const structuredLlm = model.withStructuredOutput(decisionSchema);

    const systemPrompt = `You are an AI assistant.
  
  Available actions:
  1. answer_directly – if you can answer without external data.
  2. search_documents – if the user's uploaded documents may help.
  3. search_web – if fresh or external info is required (e.g. current events, specific facts not in documents).
  
  User message:
  {input}`;

    const prompt = PromptTemplate.fromTemplate(systemPrompt);
    const chain = prompt.pipe(structuredLlm);

    const result = await chain.invoke({ input: userMessage });
    
    // Ensure we have a valid result, fallback if needed
    if (!result || !result.action) {
        return { action: "answer_directly" };
    }

    return result;
  } catch (error) {
    console.error("Error in decideTool:", error);
    return { action: "answer_directly" };
  }
};

const generateFinalAnswer = async (context, userMessage) => {
  const promptTemplate = `Context:
{context}

User Question:
{userMessage}

Answer clearly and accurately.`;

  const prompt = PromptTemplate.fromTemplate(promptTemplate);
  const chain = prompt.pipe(model).pipe(new StringOutputParser());

  return await chain.invoke({
    context: context || "No external context used.",
    userMessage: userMessage,
  });
};

module.exports = { decideTool, generateFinalAnswer };
