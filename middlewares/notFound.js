const { StatusCodes, getReasonPhrase } = require("http-status-codes");
const notFound = (req, res) => {
  return res
    .status(StatusCodes.NOT_FOUND)
    .json({
      msg: "Page not found.",
      phrase: `${getReasonPhrase(StatusCodes.NOT_FOUND)}`,
    });
};

module.exports = notFound;
