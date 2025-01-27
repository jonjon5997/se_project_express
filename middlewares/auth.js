// Imports
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { ERROR_CODES } = require("../utils/constants");

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    res
      .status(ERROR_CODES.UNAUTHORIZED)
      .send({ message: "Authorization required" });
    return; // Explicitly return to ensure no further execution
  }

  const token = authorization.replace("Bearer ", "");

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; // Attach the token payload to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    res
      .status(ERROR_CODES.UNAUTHORIZED)
      .send({ message: "Invalid or expired token" });
  }
};

module.exports = auth;
