const Message = require("../../model/messages.model.js");
const ApiResponse = require("../../utils/ApiResponse");
const ApiError = require("../../utils/ApiError");
const TryCatch = require("../../utils/TryCatch");

const getMessages = TryCatch(async (req, res, next) => {
  const { chatId } = req.params;

  if (!chatId) {
    return next(new ApiError(400, "Chat ID is required"));
  }

  const messages = await Message.find({ chatId }).sort({
    createdAt: 1,
  });

  res.status(200).json(
    new ApiResponse(200, "Messages fetched successfully", true, {
      messages,
    })
  );
});

module.exports = getMessages;
