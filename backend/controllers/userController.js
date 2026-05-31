const asyncHandler = require("../utils/asyncHandler");

const {
  getCustomInstructionsService,
  updateCustomInstructionsService,
} = require("../services/userService");

const getCustomInstructions = asyncHandler(async (req, res) => {
  const instructions = await getCustomInstructionsService(req.user._id);

  return res.status(200).json({
    success: true,
    message: "Custom instructions fetched successfully",
    data: {
      customInstructions: instructions,
    },
  });
});

const updateCustomInstructions = asyncHandler(async (req, res) => {
  const instructions = await updateCustomInstructionsService(
    req.user._id,
    req.body
  );

  return res.status(200).json({
    success: true,
    message: "Custom instructions updated successfully",
    data: {
      customInstructions: instructions,
    },
  });
});

module.exports = {
  getCustomInstructions,
  updateCustomInstructions,
};