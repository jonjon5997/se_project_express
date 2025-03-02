// Import necessary modules
const express = require("express"); // Import Express
const mongoose = require("mongoose");
const cors = require("cors");
const { login, createUser } = require("./controllers/users");
const mainRouter = require("./routes/index");
const errorHandler = require("./middlewares/error-handler");
// const auth = require("./middlewares/auth");

// Create an Express application
const app = express();

// Define a port
const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((e) => console.error(e));

// // Middleware to parse JSON requests
app.use(express.json());

// // Middleware to set a mock user ID
// app.use((req, res, next) => {
//   req.user = {
//     _id: "678701efa56f151e26245585", // Mock user ID
//   };
//   next();
// });
app.use(cors());
app.post("/signin", login);
app.post("/signup", createUser);

// Use the main router for routes
app.use("/", mainRouter);

// Centralized error handling middleware
app.use(errorHandler);

// Use the auth middleware for all protected routes
// app.use(auth);

// use the user routes
// app.use("/users", require("./routes/users"));

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
