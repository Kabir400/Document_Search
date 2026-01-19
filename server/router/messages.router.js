const express = require("express");
const router = express.Router();

//middleware
const checkLogin = require("../middleware/checkLogin.js");

//controller
const createMessage = require("../controller/messages/sendMessage.js");
const getMessages = require("../controller/messages/getMessages.js");

//routes
router.post("/send-message/:chatId", checkLogin, createMessage);
router.get("/get-messages/:chatId", checkLogin, getMessages);

module.exports = router;
