const express = require("express");

const {
  sendMessage,
  streamMessage,
} = require("../controllers/chatController");

const { protect } = require("../middlewares/authMiddleware");
const { aiRateLimiter } = require("../middlewares/rateLimitMiddleware");

const router = express.Router();

router.use(protect);
router.use(aiRateLimiter);

router.post("/:conversationId/message", sendMessage);
router.post("/:conversationId/message/stream", streamMessage);

module.exports = router;