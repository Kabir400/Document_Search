const Message = require("../../model/messages.model.js");
const { queryPinecone } = require("../../utils/pinecone");
const { tavilySearch } = require("../../utils/tavily.js");
const ApiResponse = require("../../utils/ApiResponse");
const ApiError = require("../../utils/ApiError");
const TryCatch = require("../../utils/TryCatch");
const { decideTool, generateFinalAnswer } = require("../../utils/gptHelper.js");

const sendMessage = TryCatch(async (req, res, next) => {
  const { chatId } = req.params;
  const { content } = req.body;
  const userId = req.user?._id?.toString();

  if (!content) {
    return next(new ApiError(400, "Message content is required"));
  }

  if (!chatId) {
    return next(new ApiError(400, "Chat ID is required"));
  }

  await Message.create({
    chatId,
    role: "user",
    content,
  });

  // Step 1: Decide tool

  const decision = await decideTool(content);

  let contextText = "";
  let sources = [];

  // Step 2: Execute tool

  if (decision.action === "search_documents") {
    const vectorResult = await queryPinecone({
      userId,
      query: decision.query || content,
    });

    console.log(vectorResult);
    if (vectorResult?.matches?.length) {
      contextText = vectorResult.matches.map((m) => m.metadata.text).join("\n");

      sources = ["document"];
    }
  }

  if (decision.action === "search_web") {
    contextText = await tavilySearch(decision.query || content);
    sources = ["web"];
  }

  // Step 3: Generate final answer

  const answer = await generateFinalAnswer(contextText, content);

  if (!answer) {
    return next(new ApiError(500, "Failed to generate AI response"));
  }

  // Save assistant message
  const aiMessage = await Message.create({
    chatId,
    role: "assistant",
    content: answer,
    sources,
  });

  // send response
  res.status(200).json(
    new ApiResponse(200, "Message sent successfully", true, {
      message: aiMessage,
      toolUsed: decision.action,
    })
  );
});

module.exports = sendMessage;
