//imports-->
const TryCatch = require("../utils/TryCatch.js");
const ApiError = require("../utils/ApiError.js");
const jwt = require("jsonwebtoken");
const userModel = require("../model/user.model.js");

const checkLogin = TryCatch(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new ApiError(401, "You are unauthorized"));
  }

  const token = authHeader.split(" ")[1];
  const secret = process.env.TOKEN_SECRET_KEY;

  // Decode and verify token
  let decoded;
  try {
    decoded = jwt.verify(token, secret); // Verify the token
  } catch (error) {
    return next(new ApiError(401, "Invalid or expired token"));
  }

  const user = await userModel.findById(decoded._id).select("-password");

  if (!user) {
    return next(new ApiError(401, "You are unauthorized"));
  }

  req.user = user;

  next();
});

module.exports = checkLogin;
