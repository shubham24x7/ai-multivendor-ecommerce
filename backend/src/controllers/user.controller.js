import { getCurrentUser, updateCurrentUser } from "../services/user.service.js";
import { sendSuccess } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";

export const getMe = asyncHandler(async (req, res) => {
  const user = await getCurrentUser(req.user._id);
  sendSuccess(res, { message: "Profile fetched", data: { user } });
});

export const updateMe = asyncHandler(async (req, res) => {
  const user = await updateCurrentUser(req.user._id, req.body);
  sendSuccess(res, { message: "Profile updated", data: { user } });
});
