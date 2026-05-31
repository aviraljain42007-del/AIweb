const asyncHandler = require("../utils/asyncHandler");
const { getUserUsage } = require("../services/usageService");

const getMyUsage = asyncHandler(async (req, res) => {
  const usage = await getUserUsage(req.user._id);

  return res.status(200).json({
    success: true,
    message: "Usage fetched successfully",
    data: {
      usage,
    },
  });
});

module.exports = {
  getMyUsage,
};