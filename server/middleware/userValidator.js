const { body } = require("express-validator");

//user
const userValidator = [
  body("email").isEmail().withMessage("Invalid email!"),
  body("password")
    .isStrongPassword()
    .withMessage(
      "Password must be at least 8 characters long & should contain at least 1 lowercase, 1 uppercase, 1 symbol, 1 number"
    ),
];

module.exports = userValidator;
