const CustomErrors = require("../errors");

const checkPermissions = ({ reqUser, sourceUser }) => {
  const { role } = reqUser;
  if (role === "admin" || role === "owner") return;
  if (sourceUser._id.toString() === reqUser.userId) return;
  throw new CustomErrors.UnauthorizeError("Access denied");
};

module.exports = checkPermissions;
