import { Coupon } from "../models/coupon.model.js";
import { sendSuccess } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";

export const listCoupons = asyncHandler(async (_req, res) => {
  const coupons = await Coupon.find().sort({ createdAt: -1 }).limit(100);
  sendSuccess(res, { message: "Coupons fetched", data: { coupons } });
});

export const createCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.create(req.body);
  sendSuccess(res, { statusCode: 201, message: "Coupon created", data: { coupon } });
});
