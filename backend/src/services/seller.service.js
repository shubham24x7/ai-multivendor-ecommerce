import { Seller } from "../models/seller.model.js";
import { Store } from "../models/store.model.js";
import { AppError } from "../utils/app-error.js";

export async function getSellerByUserId(userId) {
  const seller = await Seller.findOne({ userId });
  if (!seller) throw new AppError("Seller profile not found", 404);
  return seller;
}

export async function getSellerProfile(userId) {
  const seller = await getSellerByUserId(userId);
  const store = await Store.findOne({ sellerId: seller._id });
  return { seller, store };
}

export async function updateSellerProfile(userId, payload) {
  const seller = await getSellerByUserId(userId);
  const allowedFields = ["businessName", "businessEmail", "businessPhone", "taxId"];
  const update = {};

  for (const field of allowedFields) {
    if (payload[field] !== undefined) update[field] = payload[field];
  }

  return Seller.findByIdAndUpdate(seller._id, update, {
    new: true,
    runValidators: true
  });
}

export async function approveSeller(sellerId) {
  const seller = await Seller.findByIdAndUpdate(
    sellerId,
    { approvalStatus: "approved", rejectionReason: null },
    { new: true, runValidators: true }
  );

  if (!seller) throw new AppError("Seller not found", 404);
  await Store.findOneAndUpdate({ sellerId: seller._id }, { status: "active" });
  return seller;
}

export async function rejectSeller(sellerId, rejectionReason) {
  const seller = await Seller.findByIdAndUpdate(
    sellerId,
    { approvalStatus: "rejected", rejectionReason },
    { new: true, runValidators: true }
  );

  if (!seller) throw new AppError("Seller not found", 404);
  return seller;
}
