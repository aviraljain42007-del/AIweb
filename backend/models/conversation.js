const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["user", "assistant", "system"],
      required: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
    },

    mode: {
      type: String,
      enum: ["normal", "code_explainer", "summarizer", "interview_helper"],
      default: "normal",
    },

    tokensUsed: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const conversationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      default: "New Chat",
      trim: true,
      maxlength: [80, "Title cannot exceed 80 characters"],
    },

    mode: {
      type: String,
      enum: ["normal", "code_explainer", "summarizer", "interview_helper"],
      default: "normal",
    },

    messages: {
      type: [messageSchema],
      default: [],
    },

    totalTokensUsed: {
      type: Number,
      default: 0,
    },

    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Conversation", conversationSchema);