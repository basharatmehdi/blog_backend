const User = require("../models/User");
const fs = require("fs");
const { StatusCodes } = require("http-status-codes");
const CustomErrors = require("../errors");
const { attachToCookie } = require("../utils/jwt");
const createTokenUser = require("../utils/tokenUser");
const checkPermissions = require("../utils/checkPermissions");
const uploadToCloudinary = require("../utils/cloudinaryConfig");

// Get all users
const getAllUsers = async (req, res) => {
  const users = await User.find().select("-password");
  if (!users) {
    throw new CustomErrors.NotFoundError("Users not found");
  }
  res.status(StatusCodes.OK).json({
    users,
  });
};

//Get single user
const getSingleUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findOne({ _id: id }).select("-password");
  if (!user) {
    throw new CustomErrors.NotFoundError("User not found");
  }
  res.status(StatusCodes.OK).json({
    user,
  });
};

//Show current user
const showCurrentUser = async (req, res) => {
  const { userId } = req.user;
  // const user = await User.findOne({ _id: userId }).select("-password");
  // if (!user) {
  //   throw new CustomErrors.NotFoundError("User not found");
  // }
  if (!userId) {
    throw new CustomErrors.UnauthorizeError("Login required");
  }
  res.status(StatusCodes.OK).json({
    user: req.user,
  });
};

//Update user
const updateUser = async (req, res) => {
  const { userId } = req.user;
  const { name, bio } = req.body;
  const { image } = req.files;
  if (!name) {
    throw new CustomErrors.BadRequestError("Name is required");
  }
  const localPath = image[0].path;
  const uploadedImage = await uploadToCloudinary({
    file: localPath,
    folder: "blog/users",
  });
  const user = await User.findOneAndUpdate(
    { _id: userId },
    { name, bio, image: uploadedImage.secure_url },
    { new: true }
  ).select("-password");
  if (!user) {
    throw new CustomErrors.NotFoundError("User not found");
  }
  const tokenUser = createTokenUser(user);
  attachToCookie(res, tokenUser);
  fs.unlinkSync(localPath);
  res.status(StatusCodes.OK).json({
    user,
  });
};

//Update User Password
const updateUserPassword = async (req, res) => {
  const { newPassword, oldPassword } = req.body;
  if (!newPassword || !oldPassword) {
    throw new CustomErrors.BadRequestError("Both fields are required");
  }
  const user = await User.findOne({ _id: req.user.userId });
  if (!user) {
    throw new CustomErrors.NotFoundError("User not found");
  }
  const isMatch = await user.comparePassword(oldPassword);
  if (!isMatch) {
    throw new CustomErrors.UnauthorizeError("Incorrect password");
  }
  user.password = newPassword;
  await user.save();
  res.status(StatusCodes.OK).json({
    msg: "Password updated successfully",
  });
};

//Delete user
const deleteUser = async (req, res) => {
  // const { userId } = req.user;
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) {
    throw new CustomErrors.NotFoundError("User not found");
  }
  checkPermissions({ reqUser: req.user, sourceUserId: user._id });
  await user.deleteOne();
  res.status(StatusCodes.OK).json({
    msg: "User deleted successfully",
  });
};

//Update user role
const updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  if (!role) {
    throw new CustomErrors.BadRequestError("Role is required");
  }
  if (!role.includes("admin") && !role.includes("user")) {
    throw new CustomErrors.BadRequestError("Role is invalid");
  }
  const user = await User.findOne({ _id: id });
  if (!user) {
    throw new CustomErrors.NotFoundError("User not found");
  }
  user.role = role;
  await user.save();
  res.status(StatusCodes.OK).json({
    msg: "User role updated successfully",
  });
};

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
  deleteUser,
  updateUserRole,
};
