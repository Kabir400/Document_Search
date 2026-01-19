const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash-lite",
});

function extractJSON(text) {
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;
    return JSON.parse(jsonMatch[0]);
  } catch {
    return null;
  }
}

const decideTool = async (userMessage) => {
  const decisionPrompt = `
You are an AI assistant.

Available actions:
1. answer_directly – if you can answer without external data
2. search_documents – if the user's uploaded documents may help
3. search_web – if fresh or external info is required

The action should be one of:
answer_directly | search_documents | search_web

Respond ONLY in valid JSON.

Example:
{
  "action": "search_documents",
  "query": "refund policy"
}

User message:
${userMessage}
`;

  const result = await model.generateContent(decisionPrompt);
  const text = result.response.text();

  const parsed = extractJSON(text);

  if (!parsed || !parsed.action) {
    return { action: "answer_directly" };
  }

  return parsed;
};

const generateFinalAnswer = async (context, userMessage) => {
  const prompt = `
Context:
${context || "No external context used."}

User Question:
${userMessage}

Answer clearly and accurately.
`;

  const result = await model.generateContent(prompt);
  return result.response.text();
};

module.exports = { decideTool, generateFinalAnswer };
