# WTWR (What to Wear?): Back End

Project Description and Functionality
The project is a clothing item manager API designed to allow users to manage and interact with a collection of clothing items. Key features include:

# Item Management:

Users can create, view, and delete clothing items in the database.
Each clothing item includes details such as its name, weather type (hot, warm, cold), image URL, owner, likes, and creation timestamp.
User Interaction:

Users can like and unlike clothing items, with the system maintaining a unique list of likes for each item.
The functionality ensures no duplicate likes are added, and only authorized users can perform certain actions.

# Error Handling:

Provides robust error management for invalid input, missing resources, and server errors with user-friendly messages.
Follows a centralized error-handling structure to ensure consistency across the application.

# Technologies and Techniques Used

# Technologies:

Node.js: Backend runtime for building the API.
Express.js: Web framework used to define routes and handle HTTP requests/responses.
MongoDB: NoSQL database for storing clothing items and user data.
Mongoose: Object Data Modeling (ODM) library to define schemas, handle relationships, and query MongoDB.
Validator.js: For validating user input, including URLs.
Techniques:

# RESTful API Design:

Adheres to REST principles, making the API intuitive and scalable.
Enum Validation: Ensures the weather field only accepts predefined values (hot, warm, cold) for data consistency.
Middleware: Leverages Express middleware for centralized error handling and user authentication.
Schema Validation: Uses Mongoose schemas to enforce strict validation rules for all data models.
Modular Architecture: Organizes the codebase into separate files for controllers, routes, and models to maintain clarity and reusability.
Efficient Updates: Uses MongoDB operators like $addToSet and $pull for atomic updates to the likes array, ensuring high performance.
Error Codes: Implements a constants file for error codes to standardize responses across the API
