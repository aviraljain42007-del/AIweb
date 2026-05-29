const express = require("express");
const { sendMessage } = require("../controllers/chatController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(protect);

router.post("/:conversationId/message", sendMessage);

module.exports = router;