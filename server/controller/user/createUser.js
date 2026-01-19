const ApiResponse = require("../../utils/ApiResponse.js");
const ApiError = require("../../utils/ApiError.js");
const TryCatch = require("../../utils/TryCatch.js");

const userModel = require("../../model/user.model.js");

const createUser = TryCatch(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return next(new ApiError(400, "All fields are required"));
  }

  // Check if user already exists
  const isExist = await userModel.findOne({ email });
  if (isExist) {
    return next(new ApiError(400, "User already exists"));
  }

  // Create new user
  const user = await userModel.create({
    email,
    password,
  });

  // Generate tokens
  const Token = await user.generateToken();

  // Create response object with tokens
  const apiresponse = new ApiResponse(200, "User created successfully", true, {
    Token,
  });

  // Send response
  return res.status(apiresponse.status).json(apiresponse);
});

module.exports = createUser;
