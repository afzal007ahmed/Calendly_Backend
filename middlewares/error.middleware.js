const errorMiddleware = (err, _req, res, _next) => {
  console.error(err); 

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
