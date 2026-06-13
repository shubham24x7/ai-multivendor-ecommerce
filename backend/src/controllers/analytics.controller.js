import {
  adminAnalytics,
  buyerAnalytics,
  sellerAnalytics,
  trackEvent
} from "../services/analytics.service.js";
import { sendSuccess } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";

export const track = asyncHandler(async (req, res) => {
  const event = await trackEvent(req.body, req.user);
  sendSuccess(res, { statusCode: 201, message: "Analytics event tracked", data: { event } });
});

export const buyer = asyncHandler(async (req, res) => {
  const analytics = await buyerAnalytics(req.user._id);
  sendSuccess(res, { message: "Buyer analytics fetched", data: analytics });
});

export const seller = asyncHandler(async (req, res) => {
  const analytics = await sellerAnalytics(req.user._id);
  sendSuccess(res, { message: "Seller analytics fetched", data: analytics });
});

export const admin = asyncHandler(async (_req, res) => {
  const analytics = await adminAnalytics();
  sendSuccess(res, { message: "Admin analytics fetched", data: analytics });
});
