const errorMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  const response = {
    success: false,
    message: err.message || "Internal Server Error",
    errors: err.errors || [],
  };

  if (process.env.NODE_ENV === "development") {
    response.stack = err.stack;
  }
  if (err.code === "LIMIT_FILE_SIZE") {
  statusCode = 400;
  message = "File size cannot exceed 10MB";
}

  return res.status(statusCode).json(response);
};

module.exports = errorMiddleware;