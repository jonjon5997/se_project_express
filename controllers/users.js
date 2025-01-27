const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const { ERROR_CODES } = require("../utils/constants");
const { JWT_SECRET } = require("../utils/config");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      console.error(err);
      return res
        .status(ERROR_CODES.SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

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
  const { userId } = req.user;
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
      new: true, //return the updated document
      runValidators: true, //Ensure schema validators are applied
    }
  )
    .then((user) => {
      if (!user) {
        return res
          .status(ERROR_CODES.NOT_FOUND)
          .send({ message: "User not found" });
      }
      res.status(200).send(user); //Send the updated user
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

//create login controller that gets email and pasword from
//the request and authenticates them
//
const login = (req, res) => {
  const { email, password } = req.body;

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
      // Return a 401 Unauthorized error if authentication fails
      res
        .status(ERROR_CODES.UNAUTHORIZED)
        .send({ message: "Invalid email or password" });
    });
};

module.exports = {
  getUsers,
  createUser,
  getCurrentUser,
  login,
  updateUserProfile,
};
