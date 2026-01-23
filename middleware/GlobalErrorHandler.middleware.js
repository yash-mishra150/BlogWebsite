import logger from "../utils/logger.util.js";

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message =
    err.message || 'Internal Server Error';

  logger.error({
    method: req.method,
    path: req.originalUrl,
    statusCode,
    message,
    stack: err.stack
  });

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack
    })
  });
};

export default errorHandler;
