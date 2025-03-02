// const ClothingItem = require("../models/clothingItem");
// const { ERROR_CODES } = require("../utils/constants");

// const createItem = (req, res) => {
//   console.log(req);
//   console.log(req.body);

//   const { name, weather, imageUrl } = req.body;

//   ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
//     .then((item) => {
//       console.log(item);
//       res.status(201).send({ data: item });
//     })
//     .catch((err) => {
//       // Check for ValidationError
//       if (err.name === "ValidationError") {
//         return res
//           .status(ERROR_CODES.BAD_REQUEST)
//           .send({ message: "Invalid input data" });
//       }

//       return res
//         .status(ERROR_CODES.SERVER_ERROR)
//         .send({ message: "Internal Server Error" });
//     });
// };

// const getItems = (req, res) => {
//   ClothingItem.find({})
//     .then((items) => res.status(200).send(items))
//     .catch((err) => {
//       console.error("Error in getItems:", err);
//       res
//         .status(ERROR_CODES.SERVER_ERROR)
//         .send({ message: "Internal Server Error" });
//     });
// };

// const deleteItem = (req, res) => {
//   const { itemId } = req.params;
//   const userId = req.user._id; // Get the logged-in user's ID from the request

//   // Find the item and check ownership
//   ClothingItem.findById(itemId)
//     .orFail()
//     .then((item) => {
//       if (!item.owner.equals(userId)) {
//         // If the item doesn't belong to the logged-in user, return a 403 error
//         return res
//           .status(ERROR_CODES.FORBIDDEN)
//           .send({ message: "You do not have permission to delete this item" });
//       }

//       // If the user is the owner, proceed with deletion
//       return ClothingItem.findByIdAndDelete(itemId).then((deletedItem) => {
//         res.status(200).send({
//           message: "Item successfully deleted",
//           data: deletedItem,
//         });
//       });
//     })
//     .catch((err) => {
//       console.error("Error in deleteItem:", err);
//       if (err.name === "DocumentNotFoundError") {
//         return res
//           .status(ERROR_CODES.NOT_FOUND)
//           .send({ message: "Item not found" });
//       }
//       if (err.name === "CastError") {
//         return res
//           .status(ERROR_CODES.BAD_REQUEST)
//           .send({ message: "Invalid item ID format" });
//       }
//       return res
//         .status(ERROR_CODES.SERVER_ERROR)
//         .send({ message: "Internal Server Error" });
//     });
// };

// const likeItem = (req, res) => {
//   const { itemId } = req.params;
//   // Add the user ID to the likes array
//   ClothingItem.findByIdAndUpdate(
//     itemId,
//     { $addToSet: { likes: req.user._id } }, // Prevent duplicate likes
//     { new: true } // Return the updated document
//   )
//     .orFail()
//     .then((item) => res.status(200).send({ data: item }))
//     .catch((err) => {
//       console.error("Error in likeItem:", err);
//       if (err.name === "CastError") {
//         return res
//           .status(ERROR_CODES.BAD_REQUEST)
//           .send({ message: "Invalid item ID format" });
//       }
//       if (err.name === "DocumentNotFoundError") {
//         return res
//           .status(ERROR_CODES.NOT_FOUND)
//           .send({ message: "Item not found" });
//       }
//       return res
//         .status(ERROR_CODES.SERVER_ERROR)
//         .send({ message: "Internal Server Error" });
//     });
// };

// const unlikeItem = (req, res) => {
//   const { itemId } = req.params;

//   // Remove the user ID from the likes array
//   ClothingItem.findByIdAndUpdate(
//     itemId,
//     { $pull: { likes: req.user._id } }, // Remove the user's ID
//     { new: true } // Return the updated document
//   )
//     .orFail()
//     .then((item) => res.status(200).send({ data: item }))
//     .catch((err) => {
//       console.error("Error in unlikeItem:", err);
//       if (err.name === "CastError") {
//         return res
//           .status(ERROR_CODES.BAD_REQUEST)
//           .send({ message: "Invalid item ID format" });
//       }
//       if (err.name === "DocumentNotFoundError") {
//         return res
//           .status(ERROR_CODES.NOT_FOUND)
//           .send({ message: "Item not found" });
//       }
//       return res
//         .status(ERROR_CODES.SERVER_ERROR)
//         .send({ message: "Internal Server Error" });
//     });
// };

// module.exports = { createItem, getItems, deleteItem, likeItem, unlikeItem };

// Refactored clothingItems.js using next()

// const ClothingItem = require("../models/clothingItem");
// const { ERROR_CODES } = require("../utils/constants");

// const createItem = (req, res, next) => {
//   const { name, weather, imageUrl } = req.body;

//   ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
//     .then((item) => res.status(201).send({ data: item }))
//     .catch((err) => next(err)); // Pass error to middleware
// };

// const getItems = (req, res, next) => {
//   ClothingItem.find({})
//     .then((items) => res.status(200).send(items))
//     .catch((err) => next(err)); // Pass error to middleware
// };

// const deleteItem = (req, res, next) => {
//   const { itemId } = req.params;
//   const userId = req.user._id; // Get the logged-in user's ID

//   ClothingItem.findById(itemId)
//     .orFail()
//     .then((item) => {
//       if (!item.owner.equals(userId)) {
//         const err = new Error("You do not have permission to delete this item");
//         err.status = ERROR_CODES.FORBIDDEN;
//         return next(err);
//       }

//       return ClothingItem.findByIdAndDelete(itemId);
//     })
//     .then((deletedItem) =>
//       res
//         .status(200)
//         .send({ message: "Item successfully deleted", data: deletedItem })
//     )
//     .catch((err) => next(err)); // Pass error to middleware
// };

// const likeItem = (req, res, next) => {
//   const { itemId } = req.params;

//   ClothingItem.findByIdAndUpdate(
//     itemId,
//     { $addToSet: { likes: req.user._id } }, // Prevent duplicate likes
//     { new: true } // Return the updated document
//   )
//     .orFail()
//     .then((item) => res.status(200).send({ data: item }))
//     .catch((err) => next(err)); // Pass error to middleware
// };

// const unlikeItem = (req, res, next) => {
//   const { itemId } = req.params;

//   ClothingItem.findByIdAndUpdate(
//     itemId,
//     { $pull: { likes: req.user._id } }, // Remove the user's ID
//     { new: true } // Return the updated document
//   )
//     .orFail()
//     .then((item) => res.status(200).send({ data: item }))
//     .catch((err) => next(err)); // Pass error to middleware
// };

// module.exports = { createItem, getItems, deleteItem, likeItem, unlikeItem };

const ClothingItem = require("../models/clothingItem");
const { ERROR_CODES } = require("../utils/constants");
const {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
} = require("../errors/custom-errors");

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => res.status(201).send({ data: item }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Invalid input data"));
      }
      next(err); // Pass the error to the middleware
    });
};

const getItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => next(err)); // Pass error to middleware
};

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;
  const userId = req.user._id; // Get the logged-in user's ID

  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      if (!item.owner.equals(userId)) {
        return next(
          new ForbiddenError("You do not have permission to delete this item")
        );
      }
      return ClothingItem.findByIdAndDelete(itemId);
    })
    .then((deletedItem) =>
      res
        .status(200)
        .send({ message: "Item successfully deleted", data: deletedItem })
    )
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Item not found"));
      }
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid item ID format"));
      }
      next(err); // Pass error to middleware
    });
};

const likeItem = (req, res, next) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: req.user._id } }, // Prevent duplicate likes
    { new: true } // Return the updated document
  )
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid item ID format"));
      }
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Item not found"));
      }
      next(err); // Pass error to middleware
    });
};

const unlikeItem = (req, res, next) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: req.user._id } }, // Remove the user's ID
    { new: true } // Return the updated document
  )
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid item ID format"));
      }
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Item not found"));
      }
      next(err); // Pass error to middleware
    });
};

module.exports = { createItem, getItems, deleteItem, likeItem, unlikeItem };
