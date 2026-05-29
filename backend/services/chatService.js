const Conversation = require("../models/conversation");
const ApiError = require("../utils/ApiError");
const groq = require("../configs/groq");
const { buildGroqMessages, allowedModes } = require("../utils/promptBuilder");

const sendMessageService = async ({ userId, conversationId, prompt, mode }) => {
  if (!prompt || !prompt.trim()) {
    throw new ApiError(400, "Prompt is required");
  }

  if (prompt.trim().length > 5000) {
    throw new ApiError(400, "Prompt is too long");
  }

  const selectedMode = allowedModes.includes(mode) ? mode : "normal";

  const conversation = await Conversation.findOne({
    _id: conversationId,
    user: userId,
    isArchived: false,
  });

  if (!conversation) {
    throw new ApiError(404, "Conversation not found");
  }

  const userMessage = {
    role: "user",
    content: prompt.trim(),
    mode: selectedMode,
  };

  conversation.messages.push(userMessage);

  const previousMessages = conversation.messages.slice(0, -1);

  const groqMessages = buildGroqMessages({
    mode: selectedMode,
    conversationMessages: previousMessages,
    prompt: prompt.trim(),
  });

  let aiContent = "";
  let tokensUsed = 0;

  try {
    const completion = await groq.chat.completions.create({
      model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
      messages: groqMessages,
      temperature: 0.7,
    });

    aiContent = completion.choices?.[0]?.message?.content || "";
    tokensUsed = completion.usage?.total_tokens || 0;
  } catch (error) {
    conversation.messages.pop();
    await conversation.save({ validateBeforeSave: false });

    throw new ApiError(500, "AI service failed. Please try again.");
  }

  if (!aiContent) {
    conversation.messages.pop();
    await conversation.save({ validateBeforeSave: false });

    throw new ApiError(500, "AI did not return a response");
  }

  const assistantMessage = {
    role: "assistant",
    content: aiContent,
    mode: selectedMode,
    tokensUsed,
  };

  conversation.messages.push(assistantMessage);
  conversation.mode = selectedMode;
  conversation.totalTokensUsed += tokensUsed;

  if (conversation.title === "New Chat" && conversation.messages.length <= 2) {
    conversation.title =
      prompt.trim().length > 50
        ? prompt.trim().slice(0, 50) + "..."
        : prompt.trim();
  }

  await conversation.save();

  const savedAssistantMessage =
    conversation.messages[conversation.messages.length - 1];

  return {
    conversation,
    assistantMessage: savedAssistantMessage,
  };
};

module.exports = {
  sendMessageService,
};