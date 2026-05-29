const Conversation = require("../models/conversation.model");
const ApiError = require("../utils/ApiError");

const allowedModes = ["normal", "code_explainer", "summarizer", "interview_helper"];

const createConversationService = async (userId, mode = "normal") => {
  if (!allowedModes.includes(mode)) {
    throw new ApiError(400, "Invalid assistant mode");
  }

  const conversation = await Conversation.create({
    user: userId,
    title: "New Chat",
    mode,
    messages: [],
  });

  return conversation;
};

const getUserConversationsService = async (userId) => {
  const conversations = await Conversation.find({
    user: userId,
    isArchived: false,
  })
    .select("-messages")
    .sort({ updatedAt: -1 });

  return conversations;
};

const getConversationByIdService = async (userId, conversationId) => {
  const conversation = await Conversation.findOne({
    _id: conversationId,
    user: userId,
    isArchived: false,
  });

  if (!conversation) {
    throw new ApiError(404, "Conversation not found");
  }

  return conversation;
};

const renameConversationService = async (userId, conversationId, title) => {
  if (!title || !title.trim()) {
    throw new ApiError(400, "Title is required");
  }

  if (title.trim().length > 80) {
    throw new ApiError(400, "Title cannot exceed 80 characters");
  }

  const conversation = await Conversation.findOneAndUpdate(
    {
      _id: conversationId,
      user: userId,
      isArchived: false,
    },
    {
      $set: {
        title: title.trim(),
      },
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!conversation) {
    throw new ApiError(404, "Conversation not found");
  }

  return conversation;
};

const deleteConversationService = async (userId, conversationId) => {
  const conversation = await Conversation.findOneAndDelete({
    _id: conversationId,
    user: userId,
  });

  if (!conversation) {
    throw new ApiError(404, "Conversation not found");
  }

  return conversation;
};

module.exports = {
  createConversationService,
  getUserConversationsService,
  getConversationByIdService,
  renameConversationService,
  deleteConversationService,
};