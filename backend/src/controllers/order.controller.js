import { Order } from "../models/order.model.js";
import { sendSuccess } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";

export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ buyerId: req.user._id }).sort({ createdAt: -1 });
  sendSuccess(res, { message: "Orders fetched", data: { orders } });
});

export const getAllOrders = asyncHandler(async (_req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 }).limit(100);
  sendSuccess(res, { message: "Orders fetched", data: { orders } });
});
