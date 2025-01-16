const ClothingItem = require("../models/clothingItem");
const { ERROR_CODES } = require("../utils/constants");

const createItem = (req, res) => {
  console.log(req);
  console.log(req.body);

  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl })
    .then((item) => {
      console.log(item);
      res.status(201).send({ data: item });
    })
    .catch((err) => {
      console.error("Error in createItem:", err);
      res
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

  ClothingItem.findOneAndDelete({ _id: itemId })
    .orFail()
    .then(() => res.status(204).send()) // No content response
    .catch((err) => {
      console.error("Error in deleteItem:", err);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(ERROR_CODES.NOT_FOUND)
          .send({ message: "Item not found" });
      }
      res
        .status(ERROR_CODES.SERVER_ERROR)
        .send({ message: "Internal Server Error" });
    });
};

module.exports = { createItem, getItems, deleteItem };
