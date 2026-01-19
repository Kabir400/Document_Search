const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

//hashing the password before saving it to the database
userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }
  const hashedPassword = await bcrypt.hash(this.password, 10);
  this.password = hashedPassword;
});

//comparing password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

//generate access token (it is short lived token)
userSchema.methods.generateToken = async function () {
  try {
    let token = jwt.sign({ _id: this._id }, process.env.TOKEN_SECRET_KEY, {
      expiresIn: "5d",
    });
    return token;
  } catch (error) {
    console.log(error);
  }
};

module.exports = mongoose.model("user", userSchema);
