const Conversation = require("../models/conversation");
const ApiError = require("../utils/ApiError");
const groq = require("../configs/groq");
const { buildGroqMessages, allowedModes } = require("../utils/promptBuilder");
const { checkUserUsageLimit, incrementUserUsage } = require("./usageService");
const User = require("../models/user");

const sendMessageService = async ({ userId, conversationId, prompt, mode }) => {
  if (!prompt || !prompt.trim()) {
    throw new ApiError(400, "Prompt is required");
  }

  if (prompt.trim().length > 5000) {
    throw new ApiError(400, "Prompt is too long");
  }
  await checkUserUsageLimit(userId);
  const selectedMode = allowedModes.includes(mode) ? mode : "normal";

  const conversation = await Conversation.findOne({
    _id: conversationId,
    user: userId,
    isArchived: false,
  });

  if (!conversation) {
    throw new ApiError(404, "Conversation not found");
  }

  const user = await User.findById(userId);

  if(!user){
    throw new Apierror(404 , "User not found")
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
  customInstructions: user.customInstructions,
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
    await incrementUserUsage({
      userId,
      tokensUsed,
    });
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

const streamMessageService = async ({
  userId,
  conversationId,
  prompt,
  mode,
  res,
}) => {
  // 1. Prompt validation
  if (!prompt || !prompt.trim()) {
    throw new ApiError(400, "Prompt is required");
  }

  if (prompt.trim().length > 5000) {
    throw new ApiError(400, "Prompt is too long");
  }

  // 2. Mode validation
  const selectedMode = allowedModes.includes(mode) ? mode : "normal";

  // 3. Conversation ownership check
  const conversation = await Conversation.findOne({
    _id: conversationId,
    user: userId,
    isArchived: false,
  });

  if (!conversation) {
    throw new ApiError(404, "Conversation not found");
  }


  // 4. Usage limit check before Groq API call
  await checkUserUsageLimit(userId);

  const user = await User.findById(userId);

  if(!user){
    throw new Apierror(404 , "User not found")
  }

  // 5. Create user message
  const userMessage = {
    role: "user",
    content: prompt.trim(),
    mode: selectedMode,
  };

  // Add user message in memory
  conversation.messages.push(userMessage);

  // 6. Avoid duplicate latest prompt in Groq context
  const previousMessages = conversation.messages.slice(0, -1);

  // 7. Build Groq messages
  const groqMessages = buildGroqMessages({
    mode: selectedMode,
    conversationMessages: previousMessages,
    prompt: prompt.trim(),
    customInstructions: user.customInstructions,
  });

  let fullAssistantResponse = "";
  let tokensUsed = 0;

  try {
    // 8. Start Groq streaming
    const stream = await groq.chat.completions.create({
      model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
      messages: groqMessages,
      temperature: 0.7,
      stream: true,
    });

    // 9. Read Groq chunks one by one
    for await (const chunk of stream) {
      const content = chunk.choices?.[0]?.delta?.content || "";

      if (content) {
        fullAssistantResponse += content;

        // Send chunk to frontend
        res.write(
          `data: ${JSON.stringify({
            type: "chunk",
            content,
          })}\n\n`
        );
      }
    }

    // 10. If Groq returned empty response
    if (!fullAssistantResponse.trim()) {
      conversation.messages.pop();
      await conversation.save({ validateBeforeSave: false });

      res.write(
        `data: ${JSON.stringify({
          type: "error",
          message: "AI did not return a response",
        })}\n\n`
      );

      return res.end();
    }

    // 11. Approx token count for streaming
    // Groq streaming may not always return usage object directly,
    // so we estimate roughly: 1 token ≈ 4 characters
    tokensUsed = Math.ceil(
      (prompt.trim().length + fullAssistantResponse.length) / 4
    );

    // 12. Create assistant message
    const assistantMessage = {
      role: "assistant",
      content: fullAssistantResponse,
      mode: selectedMode,
      tokensUsed,
    };

    // 13. Save assistant message
    conversation.messages.push(assistantMessage);

    // 14. Update conversation metadata
    conversation.mode = selectedMode;
    conversation.totalTokensUsed += tokensUsed;

    // 15. Auto title generation for first chat
    if (conversation.title === "New Chat" && conversation.messages.length <= 2) {
      conversation.title =
        prompt.trim().length > 50
          ? prompt.trim().slice(0, 50) + "..."
          : prompt.trim();
    }

    // 16. Save conversation in MongoDB
    await conversation.save();

    // 17. Increment user usage only after successful AI response
    await incrementUserUsage({
      userId,
      tokensUsed,
    });

    // 18. Tell frontend stream is complete
    res.write(
      `data: ${JSON.stringify({
        type: "done",
        conversationId: conversation._id,
        title: conversation.title,
      })}\n\n`
    );

    return res.end();
  } catch (error) {
    // 19. Rollback user message if AI stream failed
    conversation.messages.pop();
    await conversation.save({ validateBeforeSave: false });

    res.write(
      `data: ${JSON.stringify({
        type: "error",
        message: "AI streaming failed. Please try again.",
      })}\n\n`
    );

    return res.end();
  }
};

module.exports = {
  sendMessageService,
  streamMessageService,
};
