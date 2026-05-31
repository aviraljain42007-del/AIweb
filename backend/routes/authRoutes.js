const express = require("express");

const {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  getCurrentUser,
} = require("../controllers/authController");

const { protect } = require("../middlewares/authMiddleware");
const { authRateLimiter } = require("../middlewares/rateLimitMiddleware");

const router = express.Router();

router.post("/register", authRateLimiter, registerUser);
router.post("/login", authRateLimiter, loginUser);
router.post("/logout", protect, logoutUser);
router.post("/refresh-token", refreshAccessToken);
router.get("/me", protect, getCurrentUser);

module.exports = router;