// Import necessary modules
const express = require("express"); // Import Express
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");

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

const routes = require("./routes");
app.use(express.json());
app.use(routes);

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
