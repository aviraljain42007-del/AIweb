const express = require("express");

const {
  getCustomInstructions,
  updateCustomInstructions,
} = require("../controllers/userController");

const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(protect);

router.get("/me/instructions", getCustomInstructions);
router.patch("/me/instructions", updateCustomInstructions);

module.exports = router;