// const { SOME_ERROR_CODE } = require("../utils/errors");

// const createUser = (req, res) => {
//   User.create(...)    // arguments omitted
//     .then(...)        // handle successful request
//     .catch((err) => {
//       console.error(err);
//       if (err.name === 'SomeErrorName') {
//         return res.status(SOME_ERROR_CODE).send({ message: "Appropriate error message" })
//       } else {
//         // if no errors match, return a response with status code 500
//         return res.status(500).send({ message: "Internal Server Error" })
//       }
//     });
// }

const User = require("../models/user"); // Import the User model

const createUser = (req, res) => {
  User.create(req.body) // assumes `req.body` contains the user data
    .then((user) => res.status(201).send(user)) // 201 Created for successful user creation
    .catch((err) => {
      console.error(err);

      // Handle MongoDB validation errors
      if (err.name === "ValidationError") {
        return res
          .status(400) // Bad Request
          .send({ message: "Validation failed", details: err.errors });
      }

      // Handle duplicate key errors (e.g., unique constraints like email)
      if (err.code === 11000) {
        return res
          .status(409) // Conflict
          .send({ message: "User already exists" });
      }

      // If no specific error is matched, return a 500 Internal Server Error
      return res
        .status(500)
        .send({ message: "An internal server error occurred" });
    });
};

module.exports = { createUser };
