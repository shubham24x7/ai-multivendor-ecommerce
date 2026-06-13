import {
  approveSeller,
  getSellerProfile,
  rejectSeller,
  updateSellerProfile
} from "../services/seller.service.js";
import { sendSuccess } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";

export const getMySellerProfile = asyncHandler(async (req, res) => {
  const profile = await getSellerProfile(req.user._id);
  sendSuccess(res, { message: "Seller profile fetched", data: profile });
});

export const updateMySellerProfile = asyncHandler(async (req, res) => {
  const seller = await updateSellerProfile(req.user._id, req.body);
  sendSuccess(res, { message: "Seller profile updated", data: { seller } });
});

export const approveSellerById = asyncHandler(async (req, res) => {
  const seller = await approveSeller(req.params.id);
  sendSuccess(res, { message: "Seller approved", data: { seller } });
});

export const rejectSellerById = asyncHandler(async (req, res) => {
  const seller = await rejectSeller(req.params.id, req.body.rejectionReason);
  sendSuccess(res, { message: "Seller rejected", data: { seller } });
});
