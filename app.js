// Import necessary modules
const express = require("express"); // Import Express

// Create an Express application
const app = express();

// Define a port
const { PORT = 3001 } = process.env;

// // Middleware to parse JSON requests
// app.use(express.json());

// // Define a basic route
// app.get('/', (req, res) => {
//   res.send('Hello, World! Welcome to the Express server.');
// });

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
