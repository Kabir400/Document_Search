const Message = require("../../model/messages.model.js");
const { graph } = require("../../utils/agentGraph");
const ApiResponse = require("../../utils/ApiResponse");
const ApiError = require("../../utils/ApiError");
const TryCatch = require("../../utils/TryCatch");

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

  // Execute LangGraph Workflow
  const result = await graph.invoke({
    userQuery: content,
    userId,
  });

  if (!result || !result.finalAnswer) {
    return next(new ApiError(500, "Failed to generate AI response"));
  }

  // Save assistant message
  const aiMessage = await Message.create({
    chatId,
    role: "assistant",
    content: result.finalAnswer,
    sources: result.sources || [],
  });

  // send response
  res.status(200).json(
    new ApiResponse(200, "Message sent successfully", true, {
      message: aiMessage,
      toolUsed: result.decision?.action,
    })
  );
});

module.exports = sendMessage;
