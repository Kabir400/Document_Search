const express = require("express");
const router = express.Router();

//middleware

const userValidator = require("../middleware/userValidator.js");
const validate = require("../middleware/validate.js");

//controller
const createUser = require("../controller/user/createUser.js");
const loginUser = require("../controller/user/loginUser.js");

//routes
router.post("/signup", userValidator, validate, createUser);
router.post("/login", loginUser);

module.exports = router;
