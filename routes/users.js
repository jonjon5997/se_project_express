const router = require("express").Router();
const {
  getUsers,
  createUser,
  getCurrentUser,
  updateUserProfile,
} = require("../controllers/users");

router.get("/users/me", getCurrentUser);
router.patch("/users/me", updateUserProfile);
// router.get("/", getUsers);
// router.post("/", createUser);

module.exports = router;
