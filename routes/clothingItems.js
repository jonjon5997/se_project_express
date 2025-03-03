// const router = require("express").Router();
// const auth = require("../middlewares/auth"); // Import authentication middleware

// const {
//   createItem,
//   getItems,
//   deleteItem,
//   likeItem,
//   unlikeItem,
// } = require("../controllers/clothingItems");

// router.get("/", getItems); // No auth required

// router.post("/", auth, createItem);
// router.delete("/:itemId", auth, deleteItem);
// router.put("/:itemId/likes", auth, likeItem);
// router.delete("/:itemId/likes", auth, unlikeItem);

// module.exports = router;

const router = require("express").Router();
const auth = require("../middlewares/auth");
const {
  validateClothingItem,
  validateId,
} = require("../middlewares/validation");
const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  unlikeItem,
} = require("../controllers/clothingItems");

router.get("/", getItems);
router.post("/", auth, validateClothingItem, createItem);
router.delete("/:id", auth, validateId, deleteItem);
router.put("/:id/likes", auth, validateId, likeItem);
router.delete("/:id/likes", auth, validateId, unlikeItem);

module.exports = router;
