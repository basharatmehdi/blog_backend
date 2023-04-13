const { StatusCodes } = require("http-status-codes");

const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    msg: err.message || "Internal Server Error",
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
  };

  if (err.code && err.code === 11000) {
    customError = {
      msg:
        (err.keyPattern.email === 1 && "User Already Exists") ||
        "Duplicate field value entered",
      statusCode: StatusCodes.CONFLICT,
    };
  }

  if (err.name === "ValidationError") {
    customError = {
      msg: Object.values(err.errors).map((item) => item.message),
      statusCode: StatusCodes.BAD_REQUEST,
    };
  }

  if (err.name === "CastError") {
    customError = {
      msg: "Resource not found",
      statusCode: StatusCodes.NOT_FOUND,
    };
  }

  return res.status(customError.statusCode).json({
    msg: customError.msg,
    stack: process.env.NODE_ENV === "development" ? err.stack : "",
  });
};

module.exports = errorHandlerMiddleware;
