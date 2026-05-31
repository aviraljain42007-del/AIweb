const User = require("../models/user");
const ApiError = require("../utils/ApiError");

const DAILY_PROMPT_LIMIT = 20;

const isSameDay = (date1, date2) => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

const resetDailyUsageIfNeeded = async (user) => {
  const today = new Date();
  const lastResetDate = new Date(user.usage.lastResetDate);

  if (!isSameDay(today, lastResetDate)) {
    user.usage.dailyPrompts = 0;
    user.usage.lastResetDate = today;

    await user.save({ validateBeforeSave: false });
  }

  return user;
};

const checkUserUsageLimit = async (userId) => {
  let user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  user = await resetDailyUsageIfNeeded(user);

  if (user.usage.dailyPrompts >= DAILY_PROMPT_LIMIT) {
    throw new ApiError(
      429,
      `Daily prompt limit reached. You can send ${DAILY_PROMPT_LIMIT} prompts per day.`
    );
  }

  return true;
};

const incrementUserUsage = async ({ userId, tokensUsed = 0 }) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  await resetDailyUsageIfNeeded(user);

  user.usage.dailyPrompts += 1;
  user.usage.totalPrompts += 1;
  user.usage.totalTokens += tokensUsed;

  await user.save({ validateBeforeSave: false });

  return user.usage;
};

const getUserUsage = async (userId) => {
  let user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  user = await resetDailyUsageIfNeeded(user);

  return {
    dailyPrompts: user.usage.dailyPrompts,
    dailyPromptLimit: DAILY_PROMPT_LIMIT,
    remainingPrompts: DAILY_PROMPT_LIMIT - user.usage.dailyPrompts,
    totalPrompts: user.usage.totalPrompts,
    totalTokens: user.usage.totalTokens,
    lastResetDate: user.usage.lastResetDate,
  };
};

module.exports = {
  checkUserUsageLimit,
  incrementUserUsage,
  getUserUsage,
};