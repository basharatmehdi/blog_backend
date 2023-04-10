const jwt = require("jsonwebtoken");

const createJWT = ({ payload }) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "30d" });
};

const verifyJWT = async (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

const attachToCookie = (res, user) => {
  try {
    res.cookie("token", createJWT({ payload: user }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      signed: true,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  createJWT,
  verifyJWT,
  attachToCookie,
};
