const jwt = require("jsonwebtoken");
const User = require("../models/user");
const ApiError = require("../utils/apiError");
const asyncHandler = require("../utils/asyncHandler");

const protect = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.accessToken;

  if (!token) {
    throw new ApiError(401, "Unauthorized - No access token provided");
  }

  let decodedToken;

  try {
    decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (error) {
    throw new ApiError(401, "Unauthorized - Invalid or expired access token");
  }

  const user = await User.findById(decodedToken.id);

  if (!user) {
    throw new ApiError(401, "Unauthorized - User not found");
  }

  req.user = user;
  next();
});

module.exports = {
  protect,
};