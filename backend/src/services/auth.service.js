import { Seller } from "../models/seller.model.js";
import { Store } from "../models/store.model.js";
import { User } from "../models/user.model.js";
import { AppError } from "../utils/app-error.js";
import { comparePassword, hashPassword } from "../utils/password.js";
import { createSlug } from "../utils/slug.js";
import {
  createSessionId,
  hashToken,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken
} from "../utils/tokens.js";

const REFRESH_EXPIRES_MS = 7 * 24 * 60 * 60 * 1000;

function buildAuthResponse(user, sessionId) {
  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user, sessionId);
  return { accessToken, refreshToken };
}

async function attachRefreshSession(user, refreshToken, sessionId, req) {
  const now = new Date();
  user.refreshSessions = user.refreshSessions.filter(
    (session) => !session.revokedAt && session.expiresAt > now
  );

  user.refreshSessions.push({
    sessionId,
    tokenHash: hashToken(refreshToken),
    userAgent: req.headers["user-agent"],
    ipAddress: req.ip,
    expiresAt: new Date(Date.now() + REFRESH_EXPIRES_MS)
  });

  await user.save();
}

export async function registerUser(payload, req) {
  const existingUser = await User.findOne({ email: payload.email });
  if (existingUser) {
    throw new AppError("Email already exists", 409);
  }

  const user = await User.create({
    name: payload.name,
    email: payload.email,
    phone: payload.phone,
    role: payload.role,
    passwordHash: await hashPassword(payload.password),
    status: "active"
  });

  if (payload.role === "seller") {
    const seller = await Seller.create({
      userId: user._id,
      businessName: payload.businessName,
      businessEmail: payload.email,
      businessPhone: payload.phone,
      approvalStatus: "pending"
    });

    const baseSlug = createSlug(payload.storeName);
    await Store.create({
      sellerId: seller._id,
      name: payload.storeName,
      slug: `${baseSlug}-${seller._id.toString().slice(-6)}`,
      status: "draft"
    });
  }

  const sessionId = createSessionId();
  const { accessToken, refreshToken } = buildAuthResponse(user, sessionId);
  await attachRefreshSession(user, refreshToken, sessionId, req);

  return {
    user,
    accessToken,
    refreshToken
  };
}

export async function loginUser(payload, req) {
  const user = await User.findOne({ email: payload.email }).select("+passwordHash");

  if (!user || !(await comparePassword(payload.password, user.passwordHash))) {
    throw new AppError("Invalid email or password", 401);
  }

  if (user.status !== "active") {
    throw new AppError("Account is not active", 403);
  }

  user.lastLoginAt = new Date();
  const sessionId = createSessionId();
  const { accessToken, refreshToken } = buildAuthResponse(user, sessionId);
  await attachRefreshSession(user, refreshToken, sessionId, req);

  return {
    user,
    accessToken,
    refreshToken
  };
}

export async function refreshUserSession(refreshToken, req) {
  if (!refreshToken) {
    throw new AppError("Refresh token is required", 401);
  }

  const payload = verifyRefreshToken(refreshToken);
  const user = await User.findById(payload.sub);

  if (!user || user.status !== "active") {
    throw new AppError("Invalid refresh session", 401);
  }

  const session = user.refreshSessions.find(
    (item) =>
      item.sessionId === payload.sessionId &&
      item.tokenHash === hashToken(refreshToken) &&
      !item.revokedAt &&
      item.expiresAt > new Date()
  );

  if (!session) {
    throw new AppError("Refresh session is invalid or expired", 401);
  }

  session.revokedAt = new Date();

  const newSessionId = createSessionId();
  const { accessToken, refreshToken: newRefreshToken } = buildAuthResponse(user, newSessionId);
  await attachRefreshSession(user, newRefreshToken, newSessionId, req);

  return {
    user,
    accessToken,
    refreshToken: newRefreshToken
  };
}

export async function logoutUser(refreshToken) {
  if (!refreshToken) return;

  try {
    const payload = verifyRefreshToken(refreshToken);
    const user = await User.findById(payload.sub);
    if (!user) return;

    const session = user.refreshSessions.find((item) => item.sessionId === payload.sessionId);
    if (session) {
      session.revokedAt = new Date();
      await user.save();
    }
  } catch (_error) {
    // Logout should remain idempotent.
  }
}
