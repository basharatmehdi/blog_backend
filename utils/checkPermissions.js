const CustomErrors = require("../errors");

const checkPermissions = ({ reqUser, sourceUserId }) => {
  const { role } = reqUser;
  if (role === "admin" || role === "owner") return;
  if (sourceUserId.toString() === reqUser.userId) return;
  throw new CustomErrors.UnauthorizeError("Access denied");
};

module.exports = checkPermissions;
