import { recalculateSellerTrustScore } from "../services/trust-score.service.js";
import { getSellerByUserId } from "../services/seller.service.js";
import { sendSuccess } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";

export const recalculateMine = asyncHandler(async (req, res) => {
  const seller = await getSellerByUserId(req.user._id);
  const updatedSeller = await recalculateSellerTrustScore(seller._id);
  sendSuccess(res, { message: "Trust score recalculated", data: { seller: updatedSeller } });
});

export const recalculateBySellerId = asyncHandler(async (req, res) => {
  const seller = await recalculateSellerTrustScore(req.params.id);
  sendSuccess(res, { message: "Trust score recalculated", data: { seller } });
});
