const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const { ERROR_CODES } = require("../utils/constants");
const { JWT_SECRET } = require("../utils/config");
const { BadRequestError, NotFoundError } = require("../errors/custom-errors");

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
    .catch(next); // Pass error to error handler
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch(next); // Pass error to error handler
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
