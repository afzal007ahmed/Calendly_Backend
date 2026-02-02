const errorMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode;
  const code = err.code;
  const message = err.message;
  res.status(statusCode).send({
    message: message,
    code: code,
  });
};

module.exports = { errorMiddleware };
