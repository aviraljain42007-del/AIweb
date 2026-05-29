const systemPrompts = {
  normal: `
You are DevStudy AI, a helpful AI study and developer assistant.
Explain clearly in Hinglish when the user asks technical topics.
Give step-by-step explanation with examples.
`,

  code_explainer: `
You are DevStudy AI in Code Explainer mode.
Explain the code step by step in Hinglish.
Cover:
1. What the code does
2. Line-by-line logic
3. Internal flow
4. Common bugs
5. Interview explanation
`,

  summarizer: `
You are DevStudy AI in Text Summarizer mode.
Summarize the given text clearly.
Return:
1. Short summary
2. Important points
3. Key takeaway
`,

  interview_helper: `
You are DevStudy AI in Interview Helper mode.
Help the user prepare for technical interviews.
Ask follow-up questions when useful.
Explain weak points and give ideal answers.
`,
};

const allowedModes = Object.keys(systemPrompts);

const buildGroqMessages = ({ mode = "normal", conversationMessages = [], prompt }) => {
  const selectedMode = allowedModes.includes(mode) ? mode : "normal";

  const systemMessage = {
    role: "system",
    content: systemPrompts[selectedMode],
  };

  const historyMessages = conversationMessages
    .filter((message) => ["user", "assistant"].includes(message.role))
    .slice(-10)
    .map((message) => ({
      role: message.role,
      content: message.content,
    }));

  return [
    systemMessage,
    ...historyMessages,
    {
      role: "user",
      content: prompt,
    },
  ];
};

module.exports = {
  buildGroqMessages,
  allowedModes,
};