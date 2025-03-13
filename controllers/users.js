const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const { ERROR_CODES } = require("../utils/constants");
const { JWT_SECRET } = require("../utils/config");

const BadRequestError = require("../errors/badRequestError");
const NotFoundError = require("../errors/notFoundError");
const ConflictError = require("../errors/conflictError");

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  if (password.length < 8) {
    return next(
      new BadRequestError("Password must be at least 8 characters long.")
    );
  }

  bcrypt
    .hash(password, 10)
    .then((hashedPassword) =>
      User.create({ name, avatar, email, password: hashedPassword })
    )
    .then((user) => {
      const userWithoutPassword = user.toObject();
      delete userWithoutPassword.password;
      res.status(201).send(userWithoutPassword);
    })
    .catch((err) => {
      if (err.code === 11000) {
        return next(
          new ConflictError("A user with this email already exists.")
        );
      }
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Invalid user data."));
      }
    })
    .catch(next); // Pass error to error handler
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Item Not Found"));
      }
      next(err); // catch any other errors and pass them to the error handler
    });
};

const updateUserProfile = (req, res, next) => {
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        return next(new NotFoundError("User not found"));
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Invalid user data."));
      }
    })
    .catch(next); // Pass error to error handler
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new BadRequestError("Email and password are required"));
  }

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.status(200).send({ token });
    })
    .catch(next); // Pass error to error handler
};

module.exports = { createUser, getCurrentUser, login, updateUserProfile };
