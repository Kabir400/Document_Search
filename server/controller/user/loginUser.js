const ApiResponse = require("../../utils/ApiResponse.js");
const ApiError = require("../../utils/ApiError.js");
const TryCatch = require("../../utils/TryCatch.js");

const userModel = require("../../model/user.model.js");

const login = TryCatch(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ApiError(400, "All fields are required"));
  }

  // Checking if user exists
  const user = await userModel.findOne({ email });
  if (!user) {
    return next(new ApiError(400, "Invalid email or password"));
  }

  // Comparing password
  if (!(await user.comparePassword(password))) {
    return next(new ApiError(400, "Invalid email or password"));
  }

  // Generate tokens
  const Token = await user.generateToken();

  // Create a response object with tokens
  const apiresponse = new ApiResponse(
    200,
    "User logged in successfully",
    true,
    {
      Token,
    }
  );

  // Sending response with tokens
  res.status(apiresponse.status).json(apiresponse);
});

module.exports = login;
