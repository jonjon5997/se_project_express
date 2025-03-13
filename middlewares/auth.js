// Imports
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const UnauthorizedError = require("../errors/unauthorizedError"); // Import error class

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return next(new UnauthorizedError("Authorization required"));
  }

  const token = authorization.replace("Bearer ", "");

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; // Attach the token payload to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    next(new UnauthorizedError("Invalid or expired token"));
  }
};

module.exports = auth;
