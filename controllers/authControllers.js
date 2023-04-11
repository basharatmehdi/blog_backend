const { StatusCodes } = require("http-status-codes");
const crypto = require("crypto");
const User = require("../models/User");
const CustomErrors = require("../errors");
const createTokenUser = require("../utils/tokenUser");
const { attachToCookie } = require("../utils/jwt");
// const sendEmail = require("../utils/sendEmail");
const sendVerificationEmail = require("../utils/sendVerificationEmail");

//Register
const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    throw new CustomErrors.BadRequestError("Please provide all fields");
  }
  const isFirstAccount = (await User.countDocuments({})) === 0;
  const role = isFirstAccount ? "admin" : "user";
  const verificationToken = crypto.randomBytes(40).toString("hex");
  const user = await User.create({
    name,
    email,
    password,
    role,
    verificationToken,
    verificationTokenExpires: Date.now() + 1000 * 60 * 10,
  });
  const origin = "http://localhost:4000";
  await sendVerificationEmail({
    name: user.name,
    email: user.email,
    verificationToken: user.verificationToken,
    origin: origin,
  });
  const tokenUser = createTokenUser(user);
  // attachToCookie(res, tokenUser);
  // console.log(verificationToken)
  res.status(StatusCodes.OK).json({
    user: tokenUser,
    msg: "User registered successfully, An email has been sent to your email for verification",
  });
};

//Login
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new CustomErrors.BadRequestError("Please provide all fields");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new CustomErrors.NotFoundError("Invalid user");
  }
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new CustomErrors.UnauthenticateError("Invalid email or password");
  }
  if (!user.isVerified) {
    throw new CustomErrors.UnauthenticateError("Please verify your email");
  }
  const tokenUser = createTokenUser(user);
  attachToCookie(res, tokenUser);
  res.status(StatusCodes.OK).json({
    user: tokenUser,
    msg: "User logged in successfully",
  });
};

//Verify Email
const verifyEmail = async (req, res) => {
  // const { verificationToken } = req.params;
  const { verificationToken } = req.body;
  if (!verificationToken) {
    throw new CustomErrors.BadRequestError("Verification Failed.");
  }
  const user = await User.findOne({ verificationToken });
  if (!user) {
    throw new CustomErrors.UnauthenticateError("Invalid token");
  }
  // if (user.isVerified) {
  //   throw new CustomErrors.BadRequestError("Email already verified");
  // }
  if (user.verificationTokenExpires < Date.now()) {
    throw new CustomErrors.BadRequestError("Verification token expired");
  }
  user.isVerified = true;
  user.verificationToken = null;
  user.verificationTokenExpires = null;
  await user.save();
  res.status(StatusCodes.OK).json({
    msg: "Email verified successfully",
  });
};

//Resend verification Email
const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new CustomErrors.NotFoundError("Invalid email");
  }
  if (user.isVerified) {
    throw new CustomErrors.BadRequestError("Email already verified");
  }
  const verificationToken = crypto.randomBytes(40).toString("hex");
  const verificationTokenExpires = Date.now() + 1000 * 60 * 10;

  user.verificationToken = verificationToken;
  user.verificationTokenExpires = verificationTokenExpires;
  await user.save();
  const origin = "http://localhost:4000";
  await sendVerificationEmail({
    name: user.name,
    email: user.email,
    verificationToken: verificationToken,
    origin: origin,
  });
  // const tokenUser=createTokenUser(user);
  // attachToCookie(res,tokenUser);
  res.status(StatusCodes.OK).json({
    msg: "Email sent",
  });
};

//Logout
const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(StatusCodes.OK).json({
    msg: "User logged out successfully",
  });
};

module.exports = {
  register,
  login,
  verifyEmail,
  resendVerifyEmail,
  logout,
};
