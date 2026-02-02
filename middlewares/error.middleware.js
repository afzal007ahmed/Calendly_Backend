const errorMiddleware = (err, _req, res , next ) => {
  const statusCode = err.statusCode || 500 ;
  const code = err.code || "UNKNOWN";
  const message = err.message || "SOMETHING WENT WRONG";
  res.status(statusCode).send({
    message: message,
    code: code,
  });
};

module.exports = { errorMiddleware };
