import { User } from "../models/user.model.js";
import { AppError } from "../utils/app-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import { verifyAccessToken } from "../utils/tokens.js";

export const protect = asyncHandler(async (req, _res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError("Authentication token is required", 401);
  }

  const token = authHeader.split(" ")[1];
  const payload = verifyAccessToken(token);
  const user = await User.findById(payload.sub).select("-passwordHash -refreshSessions.tokenHash");

  if (!user || user.status !== "active") {
    throw new AppError("User is not authorized", 401);
  }

  req.user = user;
  next();
});
