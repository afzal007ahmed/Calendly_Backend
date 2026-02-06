const logger = require("../utils/logger");

const errorMiddleware = (err, _req, res, _next) => {
  logger.error(err.message, { stack: err.stack });
  const statusCode = err.statusCode || 500;
  const code = err.code || "INTERNAL_ERROR";
  const message = err.message || "Something went wrong";

  res.status(statusCode).json({
    success: false,
    message,
    code,
  });
};

module.exports = {errorMiddleware};
