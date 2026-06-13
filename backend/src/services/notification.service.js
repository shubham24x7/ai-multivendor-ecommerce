import { Notification } from "../models/notification.model.js";
import { getIO } from "../sockets/index.js";

export async function createNotification(payload) {
  const notification = await Notification.create(payload);

  try {
    getIO().to(`user:${notification.userId.toString()}`).emit("notification:new", notification);
  } catch (_error) {
    // Socket server may not be available in tests or one-off scripts.
  }

  return notification;
}

export async function listUserNotifications(userId) {
  return Notification.find({ userId }).sort({ createdAt: -1 }).limit(50);
}

export async function markNotificationRead(userId, notificationId) {
  return Notification.findOneAndUpdate(
    { _id: notificationId, userId },
    { readAt: new Date() },
    { new: true }
  );
}
