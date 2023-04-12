const { verifyJWT } = require("../utils/jwt");
const CustomErrors = require("../errors");

const authenticateUser = async (req, res, next) => {
  const { token } = req.signedCookies;
  if (!token) {
    throw new CustomErrors.UnauthorizeError("Login required");
  }
  const { name, userId, role } = await verifyJWT(token);
  req.user = { name, userId, role };
  next();
};

const authorizeUser = (...roles) => {
  return (req, res, next) => {
    const { role } = req.user;
    if (!roles.includes(role)) {
      throw new CustomErrors.UnauthorizeError("Access denied");
    }
    next();
  };
};

module.exports = {
  authenticateUser,
  authorizeUser,
};
