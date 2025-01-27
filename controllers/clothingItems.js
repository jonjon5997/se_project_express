const ClothingItem = require("../models/clothingItem");
const { ERROR_CODES } = require("../utils/constants");

const createItem = (req, res) => {
  console.log(req);
  console.log(req.body);

  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => {
      console.log(item);
      res.status(201).send({ data: item });
    })
    .catch((err) => {
      // Check for ValidationError
      if (err.name === "ValidationError") {
        return res
          .status(ERROR_CODES.BAD_REQUEST)
          .send({ message: "Invalid input data" });
      }

      return res
        .status(ERROR_CODES.SERVER_ERROR)
        .send({ message: "Internal Server Error" });
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      console.error("Error in getItems:", err);
      res
        .status(ERROR_CODES.SERVER_ERROR)
        .send({ message: "Internal Server Error" });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  const userId = req.user._id; // Get the logged-in user's ID from the request

  // Find the item and check ownership
  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      if (!item.owner.equals(userId)) {
        // If the item doesn't belong to the logged-in user, return a 403 error
        return res
          .status(ERROR_CODES.FORBIDDEN)
          .send({ message: "You do not have permission to delete this item" });
      }

      // If the user is the owner, proceed with deletion
      return ClothingItem.findByIdAndDelete(itemId).then((deletedItem) => {
        res.status(200).send({
          message: "Item successfully deleted",
          data: deletedItem,
        });
      });
    })
    .catch((err) => {
      console.error("Error in deleteItem:", err);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(ERROR_CODES.NOT_FOUND)
          .send({ message: "Item not found" });
      } else if (err.name === "CastError") {
        return res
          .status(ERROR_CODES.BAD_REQUEST)
          .send({ message: "Invalid item ID format" });
      }
      return res
        .status(ERROR_CODES.SERVER_ERROR)
        .send({ message: "Internal Server Error" });
    });
};

const likeItem = (req, res) => {
  const { itemId } = req.params;
  // Add the user ID to the likes array
  ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: req.user._id } }, // Prevent duplicate likes
    { new: true } // Return the updated document
  )
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      console.error("Error in likeItem:", err);
      if (err.name === "CastError") {
        return res
          .status(ERROR_CODES.BAD_REQUEST)
          .send({ message: "Invalid item ID format" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(ERROR_CODES.NOT_FOUND)
          .send({ message: "Item not found" });
      }
      return res
        .status(ERROR_CODES.SERVER_ERROR)
        .send({ message: "Internal Server Error" });
    });
};

const unlikeItem = (req, res) => {
  const { itemId } = req.params;

  // Remove the user ID from the likes array
  ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: req.user._id } }, // Remove the user's ID
    { new: true } // Return the updated document
  )
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      console.error("Error in unlikeItem:", err);
      if (err.name === "CastError") {
        return res
          .status(ERROR_CODES.BAD_REQUEST)
          .send({ message: "Invalid item ID format" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(ERROR_CODES.NOT_FOUND)
          .send({ message: "Item not found" });
      }
      return res
        .status(ERROR_CODES.SERVER_ERROR)
        .send({ message: "Internal Server Error" });
    });
};

module.exports = { createItem, getItems, deleteItem, likeItem, unlikeItem };
