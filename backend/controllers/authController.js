const asyncHandler = require("../utils/asyncHandler");

const {
  registerUserService,
  loginUserService,
  logoutUserService,
  refreshAccessTokenService,
  getCurrentUserService,
} = require("../services/authServices");

const accessTokenCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 15 * 60 * 1000, // 15 minutes
};

const refreshTokenCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "none",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

const registerUser = asyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } = await registerUserService(
    req.body
  );

  return res
    .status(201)
    .cookie("accessToken", accessToken, accessTokenCookieOptions)
    .cookie("refreshToken", refreshToken, refreshTokenCookieOptions)
    .json({
      success: true,
      message: "User registered successfully",
      data: {
        user,
      },
    });
});

const loginUser = asyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } = await loginUserService(req.body);

  return res
    .status(200)
    .cookie("accessToken", accessToken, accessTokenCookieOptions)
    .cookie("refreshToken", refreshToken, refreshTokenCookieOptions)
    .json({
      success: true,
      message: "User logged in successfully",
      data: {
        user,
      },
    });
});

const logoutUser = asyncHandler(async (req, res) => {
  await logoutUserService(req.user._id);

  return res
    .status(200)
    .clearCookie("accessToken", accessTokenCookieOptions)
    .clearCookie("refreshToken", refreshTokenCookieOptions)
    .json({
      success: true,
      message: "User logged out successfully",
      data: null,
    });
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies?.refreshToken;

  const { user, accessToken, refreshToken } = await refreshAccessTokenService(
    incomingRefreshToken
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, accessTokenCookieOptions)
    .cookie("refreshToken", refreshToken, refreshTokenCookieOptions)
    .json({
      success: true,
      message: "Access token refreshed successfully",
      data: {
        user,
      },
    });
});

const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await getCurrentUserService(req.user._id);

  return res.status(200).json({
    success: true,
    message: "Current user fetched successfully",
    data: {
      user,
    },
  });
});

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  getCurrentUser,
};