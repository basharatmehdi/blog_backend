const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const CustomErrors = require("../errors");
const createTokenUser = require("../utils/tokenUser");
const { attachToCookie } = require("../utils/jwt");

//Register
const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    throw new CustomErrors.BadRequestError("Please provide all fields");
  }
  const isFirstAccount = (await User.countDocument({})) === 0;
  const role = isFirstAccount ? "admin" : "user";
  const user = await User.create({ name, email, password, role });
  const tokenUser = createTokenUser(user);
  attachToCookie(res, tokenUser);
  res
    .status(StatusCodes.OK)
    .json({ tokenUser, msg: "User registered successfully" });
};

//Login
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new CustomErrors.BadRequestError("Please provide all fields");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new CustomErrors.NotFoundError("Invalid email or password");
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
    tokenUser,
    msg: "User logged in successfully",
  });
};

module.exports = {
  register,
  login,
};
