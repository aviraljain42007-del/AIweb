const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const ApiError = require("../utils/apiError");

const generateAccessAndRefreshTokens = async (userId) => {
  const user = await User.findById(userId).select("+refreshToken");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
};

const registerUserService = async ({ name, email, password }) => {
  if (!name || !email || !password) {
    throw new ApiError(400, "Name, email and password are required");
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(409, "User already exists with this email");
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const createdUser = await User.findById(user._id);

  return {
    user: createdUser,
    accessToken,
    refreshToken,
  };
};

const loginUserService = async ({ email, password }) => {
  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await User.findOne({ email }).select("+password +refreshToken");

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid email or password");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id);

  return {
    user: loggedInUser,
    accessToken,
    refreshToken,
  };
};

const logoutUserService = async (userId) => {
  await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        refreshToken: null,
      },
    },
    {
      new: true,
    }
  );

  return true;
};

const refreshAccessTokenService = async (incomingRefreshToken) => {
  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized - No refresh token provided");
  }

  let decodedToken;

  try {
    decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
  } catch (error) {
    throw new ApiError(401, "Unauthorized - Invalid or expired refresh token");
  }

  const user = await User.findById(decodedToken.id).select("+refreshToken");

  if (!user) {
    throw new ApiError(401, "Unauthorized - User not found");
  }

  if (incomingRefreshToken !== user.refreshToken) {
    throw new ApiError(401, "Unauthorized - Refresh token does not match");
  }

  const accessToken = user.generateAccessToken();
  const newRefreshToken = user.generateRefreshToken();

  user.refreshToken = newRefreshToken;
  await user.save({ validateBeforeSave: false });

  const safeUser = await User.findById(user._id);

  return {
    user: safeUser,
    accessToken,
    refreshToken: newRefreshToken,
  };
};

const getCurrentUserService = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return user;
};

module.exports = {
  registerUserService,
  loginUserService,
  logoutUserService,
  refreshAccessTokenService,
  getCurrentUserService,
};