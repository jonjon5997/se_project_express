const router = require("express").Router();
const { ERROR_CODES } = require("../utils/constants");

const itemRouter = require("./clothingItems");
const userRouter = require("./users");

router.use("/users", userRouter);
router.use("/items", itemRouter);

router.use((req, res) => {
  res.status(ERROR_CODES.NOT_FOUND).send({ message: "Router not found" });
});

module.exports = router;
