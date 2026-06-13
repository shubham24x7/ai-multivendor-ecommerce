import { User } from "../models/user.model.js";
import { AppError } from "../utils/app-error.js";

export async function getCurrentUser(userId) {
  const user = await User.findById(userId);
  if (!user) throw new AppError("User not found", 404);
  return user;
}

export async function updateCurrentUser(userId, payload) {
  const allowedFields = ["name", "phone", "preferredLanguage", "preferredCurrency", "addresses"];
  const update = {};

  for (const field of allowedFields) {
    if (payload[field] !== undefined) update[field] = payload[field];
  }

  const user = await User.findByIdAndUpdate(userId, update, {
    new: true,
    runValidators: true
  });

  if (!user) throw new AppError("User not found", 404);
  return user;
}
