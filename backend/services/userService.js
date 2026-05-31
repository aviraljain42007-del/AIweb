const User = require("../models/user");
const ApiError = require("../utils/ApiError");

const getCustomInstructionsService = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return user.customInstructions;
};

const updateCustomInstructionsService = async (userId, instructions) => {
  const allowedFields = ["preferredLanguage", "learningGoal", "responseStyle"];

  const updateData = {};

  allowedFields.forEach((field) => {
    if (instructions[field] !== undefined) {
      updateData[`customInstructions.${field}`] = instructions[field];
    }
  });

  const user = await User.findByIdAndUpdate(
    userId,
    {
      $set: updateData,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return user.customInstructions;
};

module.exports = {
  getCustomInstructionsService,
  updateCustomInstructionsService,
};