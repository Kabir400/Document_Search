const express = require("express");
const router = express.Router();

//middleware
const checkLogin = require("../middleware/checkLogin.js");

//controller
const createChat = require("../controller/chat/createChat.js");
const getChats = require("../controller/chat/getChat.js");

//routes
router.post("/create-chat", checkLogin, createChat);
router.get("/get-chats", checkLogin, getChats);

module.exports = router;
