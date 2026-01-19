const { validationResult } = require("express-validator");

const ApiError = require("../utils/ApiError.js");

const Validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  const errMsg = errors.array()[0].msg;
  next(new ApiError(400, errMsg));
};

module.exports = Validate;
