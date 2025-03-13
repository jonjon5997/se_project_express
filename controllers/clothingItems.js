const ClothingItem = require("../models/clothingItem");
const { ERROR_CODES } = require("../utils/constants");

const BadRequestError = require("../errors/badRequestError");
const NotFoundError = require("../errors/notFoundError");
const ForbiddenError = require("../errors/forbiddenError");

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
  const { id } = req.params;
  const userId = req.user._id; // Get the logged-in user's ID

  ClothingItem.findById(id)
    .orFail()
    .then((item) => {
      if (!item.owner.equals(userId)) {
        throw new ForbiddenError(
          "You do not have permission to delete this item"
        );
      }
      return ClothingItem.findByIdAndDelete(id);
    })
    .then((deletedItem) => {
      if (!deletedItem) {
        throw new NotFoundError("Item not found");
      }
      res
        .status(200)
        .send({ message: "Item successfully deleted", data: deletedItem });
    })
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
  const { id } = req.params;

  ClothingItem.findByIdAndUpdate(
    id,
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
  const { id } = req.params;

  ClothingItem.findByIdAndUpdate(
    id,
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
