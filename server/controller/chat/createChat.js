const Chat = require("../../model/chat.model.js");
const ApiResponse = require("../../utils/ApiResponse.js");
const TryCatch = require("../../utils/TryCatch.js");

createChat = TryCatch(async (req, res) => {
  const userId = req.user._id;
  const { title } = req.body;

  const chat = await Chat.create({
    userId,
    title: title || "New Chat",
  });

  res.status(201).json(
    new ApiResponse(201, "Chat created successfully", true, {
      chat,
    })
  );
});

module.exports = createChat;
