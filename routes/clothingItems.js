const router = require("express").Router();
const auth = require("../middlewares/auth"); // Import authentication middleware
const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  unlikeItem,
} = require("../controllers/clothingItems");

router.get("/", getItems); // No auth required

router.post("/", auth, createItem);
router.delete("/:itemId", auth, deleteItem);
router.put("/:itemId/likes", auth, likeItem);
router.delete("/:itemId/likes", auth, unlikeItem);

module.exports = router;
