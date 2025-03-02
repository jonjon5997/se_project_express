// middlewares/error-handler.js

// middlewares/error-handler.js
const {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
} = require("../errors/custom-errors"); // Import the error classes

const errorHandler = (err, req, res, next) => {
  console.error(err.stack); // Log the error stack trace

  // Default values
  let statusCode = 500;
  let message = "An unexpected error occurred";

  // Handle custom errors
  if (err instanceof BadRequestError) {
    statusCode = err.statusCode || 400;
    message = err.message;
  } else if (err instanceof UnauthorizedError) {
    statusCode = err.statusCode || 401;
    message = err.message;
  } else if (err instanceof ForbiddenError) {
    statusCode = err.statusCode || 403;
    message = err.message;
  } else if (err instanceof NotFoundError) {
    statusCode = err.statusCode || 404;
    message = err.message;
  } else if (err instanceof ConflictError) {
    statusCode = err.statusCode || 409;
    message = err.message;
  }

  // Send response with the appropriate status and message
  res.status(statusCode).json({ message });
};

module.exports = errorHandler;
