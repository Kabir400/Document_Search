const Chat = require("../../model/chat.model.js");
const ApiResponse = require("../../utils/ApiResponse.js");
const TryCatch = require("../../utils/TryCatch.js");

getChats = TryCatch(async (req, res) => {
  const userId = req.user._id;

  const chats = await Chat.find({ userId }).sort({
    createdAt: -1,
  });

  res.status(200).json(
    new ApiResponse(200, "Chats fetched successfully", true, {
      chats,
    })
  );
});

module.exports = getChats;
