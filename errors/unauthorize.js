const CustomError = require("../errors/customError");
const { StatusCodes } = require("http-status-codes");

class UnauthorizeError extends CustomError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.FORBIDDEN;
  }
}

module.exports = UnauthorizeError;
