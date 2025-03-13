const router = require("express").Router();
const NotFoundError = require("../errors/notFoundError");

const itemRouter = require("./clothingItems");
const userRouter = require("./users");

router.use("/users", userRouter);
router.use("/items", itemRouter);

// Middleware for handling unknown routes
router.use((req, res, next) => {
  next(new NotFoundError("Route Not Found"));
});

module.exports = router;
