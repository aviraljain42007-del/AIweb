const express = require("express");
const { getMyUsage } = require("../controllers/usageController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(protect);

router.get("/me", getMyUsage);

module.exports = router;