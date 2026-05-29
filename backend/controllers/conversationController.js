const asyncHandler = require("../utils/asyncHandler");

const {
  createConversationService,
  getUserConversationsService,
  getConversationByIdService,
  renameConversationService,
  deleteConversationService,
} = require("../services/conversationService");

const createConversation = asyncHandler(async (req, res) => {
  const { mode } = req.body;

  const conversation = await createConversationService(req.user._id, mode);

  return res.status(201).json({
    success: true,
    message: "Conversation created successfully",
    data: {
      conversation,
    },
  });
});

const getUserConversations = asyncHandler(async (req, res) => {
  const conversations = await getUserConversationsService(req.user._id);

  return res.status(200).json({
    success: true,
    message: "Conversations fetched successfully",
    data: {
      conversations,
    },
  });
});

const getConversationById = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;

  const conversation = await getConversationByIdService(
    req.user._id,
    conversationId
  );

  return res.status(200).json({
    success: true,
    message: "Conversation fetched successfully",
    data: {
      conversation,
    },
  });
});

const renameConversation = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;
  const { title } = req.body;

  const conversation = await renameConversationService(
    req.user._id,
    conversationId,
    title
  );

  return res.status(200).json({
    success: true,
    message: "Conversation renamed successfully",
    data: {
      conversation,
    },
  });
});

const deleteConversation = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;

  await deleteConversationService(req.user._id, conversationId);

  return res.status(200).json({
    success: true,
    message: "Conversation deleted successfully",
    data: null,
  });
});

module.exports = {
  createConversation,
  getUserConversations,
  getConversationById,
  renameConversation,
  deleteConversation,
};