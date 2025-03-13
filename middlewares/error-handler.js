// middlewares/error-handler.js

// Import the error classes
const BadRequestError = require("../errors/badRequestError");
const NotFoundError = require("../errors/notFoundError");
const ForbiddenError = require("../errors/forbiddenError");
const ConflictError = require("../errors/conflictError");
const UnauthorizedError = require("../errors/unauthorizedError");

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
