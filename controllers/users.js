const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const { ERROR_CODES } = require("../utils/constants");
const { JWT_SECRET } = require("../utils/config");

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  if (password.length < 8) {
    return res
      .status(ERROR_CODES.BAD_REQUEST)
      .send({ message: "Password must be at least 8 characters long." });
  }

  bcrypt
    .hash(password, 10)
    .then((hashedPassword) =>
      User.create({ name, avatar, email, password: hashedPassword })
    )

    .then((user) => {
      // Remove password before sending the response
      const userWithoutPassword = user.toObject(); // Convert to plain JavaScript object
      delete userWithoutPassword.password;

      res.status(201).send(userWithoutPassword);
    })
    .catch((err) => {
      console.error(err);
      // Handle duplicate email error
      if (err.code === 11000) {
        return res
          .status(ERROR_CODES.CONFLICT)
          .send({ message: "A user with this email already exists" });
      }

      if (err.name === "ValidationError") {
        return res
          .status(ERROR_CODES.BAD_REQUEST)
          .send({ message: "Invalid input data" });
      }
      return res
        .status(ERROR_CODES.SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

const getCurrentUser = (req, res) => {
  const userId = req.user._id;
  User.findById(userId)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(ERROR_CODES.NOT_FOUND)
          .send({ message: "User not found" });
      }
      if (err.name === "CastError") {
        return res
          .status(ERROR_CODES.BAD_REQUEST)
          .send({ message: "Invalid user ID format" });
      }
      return res
        .status(ERROR_CODES.SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

const updateUserProfile = (req, res) => {
  const { name, avatar } = req.body;
  const userId = req.user._id; // Get user ID from request payload (set by auth middleware)

  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    {
      new: true, // Return updated document
      runValidators: true, // Ensure schema validators are applied
    }
  )
    .then((user) => {
      if (!user) {
        return res
          .status(ERROR_CODES.NOT_FOUND)
          .send({ message: "User not found" });
      }
      return res.status(200).send(user); // Send the updated user
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(ERROR_CODES.BAD_REQUEST)
          .send({ message: "Invalid input data" });
      }
      return res
        .status(ERROR_CODES.SERVER_ERROR)
        .send({ message: "An error occurred on the server" });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  // Check if email or password is missing
  if (!email || !password) {
    return res
      .status(ERROR_CODES.BAD_REQUEST)
      .send({ message: "Email and password are required" });
  }

  // Using the custom Mongoose method `findUserByCredentials`
  User.findUserByCredentials(email, password)
    .then((user) => {
      // Create a JWT token with a 7-day expiration
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });

      // Send the token in the response body
      res.status(200).send({ token });
    })
    .catch((err) => {
      console.error(err);

      // Handle authentication failure (wrong credentials)
      if (err.message === "Invalid credentials") {
        return res
          .status(ERROR_CODES.UNAUTHORIZED)
          .send({ message: "Invalid email or password" });
      }

      // Handle any other errors with a 500 status code
      res
        .status(ERROR_CODES.SERVER_ERROR)
        .send({ message: "Internal Server Error" });
    });
};

module.exports = {
  createUser,
  getCurrentUser,
  login,
  updateUserProfile,
};
