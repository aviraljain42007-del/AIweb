const express = require("express");

const {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  getCurrentUser,
} = require("../controllers/authController");

const { protect } = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", protect, logoutUser);
router.post("/refresh-token", refreshAccessToken);
router.get("/me", protect, getCurrentUser);

module.exports = router;