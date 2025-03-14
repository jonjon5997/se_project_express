// Load environment variables at the very beginning
require("dotenv").config();

// Import necessary modules
const express = require("express"); // Import Express
const mongoose = require("mongoose");
const cors = require("cors");
const { errors, celebrate, Joi } = require("celebrate");
const { login, createUser } = require("./controllers/users");
const mainRouter = require("./routes/index");
const errorHandler = require("./middlewares/error-handler");

const { requestLogger, errorLogger } = require("./middlewares/logger");

// Create an Express application
const app = express();

// Define a port
const { PORT = 3001 } = process.env;

// Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((e) => console.error(e));

// Middleware
app.use(express.json());
app.use(cors());

// Connect request logger **before authentication routes**
app.use(requestLogger);

// Crash test route
app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

// **Apply celebrate validation schemas to authentication routes**
app.post(
  "/signin",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().min(8).required(),
    }),
  }),
  login
);

app.post(
  "/signup",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      avatar: Joi.string().uri().optional(),
      email: Joi.string().email().required(),
      password: Joi.string().min(8).required(),
    }),
  }),
  createUser
);

// Use the main router for routes
app.use("/", mainRouter);

// Connect error logger
app.use(errorLogger);
app.use(errors()); // Celebrate error handler

// Centralized error handling middleware
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
