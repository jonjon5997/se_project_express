const router = require("express").Router();
const auth = require("../middlewares/auth");
const {
  validateUser,
  validateLogin,
  validateId,
  validateUserProfile,
} = require("../middlewares/validation");
const { getCurrentUser, updateUserProfile } = require("../controllers/users");

router.get("/me", auth, getCurrentUser);
router.patch("/me", auth, validateUserProfile, updateUserProfile);

module.exports = router;
