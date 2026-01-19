const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "chat",
      required: true,
      index: true,
    },

    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },

    content: {
      type: String,
      required: true,
    },

    sources: [
      {
        type: String,
        enum: ["document", "web"],
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("message", messageSchema);
