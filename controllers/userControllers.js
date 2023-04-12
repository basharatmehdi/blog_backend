const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");

const getAllUsers = async (req, res) => {
  console.log(req.user);
  const users = await User.find();
  res.status(StatusCodes.OK).json({
    users,
  });
};

module.exports = {
  getAllUsers,
};
