import { Review } from "../models/review.model.js";
import { sendSuccess } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";

export const getProductReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ productId: req.params.productId, status: "published" }).sort({
    createdAt: -1
  });
  sendSuccess(res, { message: "Reviews fetched", data: { reviews } });
});

export const createReview = asyncHandler(async (req, res) => {
  const review = await Review.create({
    ...req.body,
    buyerId: req.user._id
  });
  sendSuccess(res, { statusCode: 201, message: "Review created", data: { review } });
});
