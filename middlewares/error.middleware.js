const errorMiddleware = (err, _req, res) => {
  const statusCode = err.code;
  const message = err.message;
  res.status(statusCode).send({
    message: message,
  });
};



module.exports = { errorMiddleware } ;