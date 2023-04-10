const CustomError = require("../errors/customError");
const { StatusCodes } = require("http-status-codes");

class UnauthenticateError extends CustomError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}

module.exports = UnauthenticateError;
