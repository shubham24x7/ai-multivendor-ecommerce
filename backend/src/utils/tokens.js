import crypto from "crypto";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export function signAccessToken(user) {
  return jwt.sign(
    {
      sub: user._id.toString(),
      role: user.role,
      email: user.email
    },
    env.jwt.accessSecret,
    {
      expiresIn: env.jwt.accessExpiresIn
    }
  );
}

export function signRefreshToken(user, sessionId) {
  return jwt.sign(
    {
      sub: user._id.toString(),
      sessionId
    },
    env.jwt.refreshSecret,
    {
      expiresIn: env.jwt.refreshExpiresIn
    }
  );
}

export function verifyAccessToken(token) {
  return jwt.verify(token, env.jwt.accessSecret);
}

export function verifyRefreshToken(token) {
  return jwt.verify(token, env.jwt.refreshSecret);
}

export function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function createSessionId() {
  return crypto.randomUUID();
}

export function getRefreshCookieOptions() {
  return {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: env.isProduction ? "none" : "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000
  };
}
