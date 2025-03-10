// const router = require("express").Router();
// const auth = require("../middlewares/auth");
// const { getCurrentUser, updateUserProfile } = require("../controllers/users");

// router.get("/me", auth, getCurrentUser);
// router.patch("/me", auth, updateUserProfile);
// // router.get("/", getUsers);
// // router.post("/", createUser);

// module.exports = router;

const router = require("express").Router();
const auth = require("../middlewares/auth");
const {
  validateUser,
  validateLogin,
  validateId,
} = require("../middlewares/validation");
const { getCurrentUser, updateUserProfile } = require("../controllers/users");

router.get("/me", auth, getCurrentUser);
router.patch("/me", auth, updateUserProfile);

module.exports = router;
