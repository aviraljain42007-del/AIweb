const express = require("express");

const {
  createConversation,
  getUserConversations,
  getConversationById,
  renameConversation,
  deleteConversation,
} = require("../controllers/conversationController");

const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(protect);

router.route("/")
  .post(createConversation)
  .get(getUserConversations);

router.route("/:conversationId")
  .get(getConversationById)
  .patch(renameConversation)
  .delete(deleteConversation);

module.exports = router;