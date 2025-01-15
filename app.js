// Import necessary modules
const express = require("express"); // Import Express
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");
const routes = require("./routes");

// Create an Express application
const app = express();

// Define a port
const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("connected to mongodb");
  })
  .catch((e) => console.error(e));
// // Middleware to parse JSON requests
app.use(express.json());
app.use("/", mainRouter);

app.use(express.json());
app.use(routes);

// Middleware to parse JSON requests
app.use(express.json());

// Middleware to set a mock user ID
app.use((req, res, next) => {
  req.user = {
    _id: "678701efa56f151e26245585", // Mock user ID
  };
  next();
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
