import {
  listUserNotifications,
  markNotificationRead
} from "../services/notification.service.js";
import { sendSuccess } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";

export const getMyNotifications = asyncHandler(async (req, res) => {
  const notifications = await listUserNotifications(req.user._id);
  sendSuccess(res, { message: "Notifications fetched", data: { notifications } });
});

export const markRead = asyncHandler(async (req, res) => {
  const notification = await markNotificationRead(req.user._id, req.params.id);
  sendSuccess(res, { message: "Notification marked as read", data: { notification } });
});
