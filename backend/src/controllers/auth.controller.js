import { env } from "../config/env.js";
import {
  loginUser,
  logoutUser,
  refreshUserSession,
  registerUser
} from "../services/auth.service.js";
import { sendSuccess } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";
import { getRefreshCookieOptions } from "../utils/tokens.js";

function setRefreshCookie(res, refreshToken) {
  res.cookie(env.jwt.refreshCookieName, refreshToken, getRefreshCookieOptions());
}

function clearRefreshCookie(res) {
  res.clearCookie(env.jwt.refreshCookieName, {
    ...getRefreshCookieOptions(),
    maxAge: undefined
  });
}

export const register = asyncHandler(async (req, res) => {
  const result = await registerUser(req.body, req);
  setRefreshCookie(res, result.refreshToken);

  sendSuccess(res, {
    statusCode: 201,
    message: "Registration successful",
    data: {
      user: result.user,
      accessToken: result.accessToken
    }
  });
});

export const login = asyncHandler(async (req, res) => {
  const result = await loginUser(req.body, req);
  setRefreshCookie(res, result.refreshToken);

  sendSuccess(res, {
    message: "Login successful",
    data: {
      user: result.user,
      accessToken: result.accessToken
    }
  });
});

export const refreshToken = asyncHandler(async (req, res) => {
  const token = req.cookies[env.jwt.refreshCookieName];
  const result = await refreshUserSession(token, req);
  setRefreshCookie(res, result.refreshToken);

  sendSuccess(res, {
    message: "Token refreshed",
    data: {
      user: result.user,
      accessToken: result.accessToken
    }
  });
});

export const logout = asyncHandler(async (req, res) => {
  const token = req.cookies[env.jwt.refreshCookieName];
  await logoutUser(token);
  clearRefreshCookie(res);

  sendSuccess(res, {
    message: "Logout successful"
  });
});

export const me = asyncHandler(async (req, res) => {
  sendSuccess(res, {
    message: "Current user fetched",
    data: {
      user: req.user
    }
  });
});
