const asyncHandler = require("../utils/asyncHandler");
const { sendMessageService , streamMessageService } = require("../services/chatService");

exports.sendMessage = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;
  const { prompt, mode } = req.body;

  const { conversation, assistantMessage } = await sendMessageService({
    userId: req.user._id,
    conversationId,
    prompt,
    mode,
  });

  return res.status(200).json({
    success: true,
    message: "AI response generated successfully",
    data: {
      conversation,
      assistantMessage,
    },
  });
});

exports.streamMessage = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;
  const { prompt, mode } = req.body;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  await streamMessageService({
    userId: req.user._id,
    conversationId,
    prompt,
    mode,
    res,
  });
});

