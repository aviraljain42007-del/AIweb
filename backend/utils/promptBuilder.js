const systemPrompts = {
  normal: `
You are DevStudy AI, a helpful AI study and developer assistant.
Explain clearly and practically.
`,

  code_explainer: `
You are DevStudy AI in Code Explainer mode.
Explain the code step by step.
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

const buildCustomInstructionText = (customInstructions = {}) => {
  const preferredLanguage =
    customInstructions.preferredLanguage || "Hinglish";

  const learningGoal = customInstructions.learningGoal || "";

  const responseStyle =
    customInstructions.responseStyle || "Step-by-step explanation";

  return `
User preferences:
- Preferred language: ${preferredLanguage}
- Learning goal: ${learningGoal || "Not specified"}
- Response style: ${responseStyle}

Follow these preferences unless the user's latest request says otherwise.
`;
};

const buildGroqMessages = ({
  mode = "normal",
  conversationMessages = [],
  prompt,
  customInstructions = {},
}) => {
  const selectedMode = allowedModes.includes(mode) ? mode : "normal";

  const systemMessage = {
    role: "system",
    content: `
${systemPrompts[selectedMode]}

${buildCustomInstructionText(customInstructions)}
`,
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