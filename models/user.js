const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const UnauthorizedError = require("../errors/unauthorizedError");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 2, maxlength: 30 },
  avatar: {
    type: String,
    required: [true, "The avatar field is required."],
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: "You must enter a valid URL",
    },
  },
  email: {
    type: String,
    required: [true, "The email field is required."],
    unique: true,
    validate: {
      validator: (value) => validator.isEmail(value),
      message: "You must enter a valid email address",
    },
  },
  password: {
    type: String,
    required: [true, "The password field is required."],
    select: false, // Ensures the password is not returned in queries by default
  },
});

// Static method for finding user by credentials
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select("+password") // Include password in the query
    .then((user) => {
      console.log(user);
      if (!user) {
        // Reject if no user is found
        return Promise.reject(new UnauthorizedError("Invalid Credentials"));
      }

      // Compare the provided password with the hashed password in the database
      return bcrypt.compare(password, user.password).then((isMatch) => {
        if (!isMatch) {
          // Reject if the password does not match
          return Promise.reject(new UnauthorizedError("Invalid Credentials"));
        }

        // Return the user if credentials are valid
        return user;
      });
    });
};

module.exports = mongoose.model("user", userSchema);
