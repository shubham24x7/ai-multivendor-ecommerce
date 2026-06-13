import { GroupBuy } from "../models/group-buy.model.js";
import { Product } from "../models/product.model.js";
import { Seller } from "../models/seller.model.js";
import { AppError } from "../utils/app-error.js";
import { emitToRoom } from "../sockets/index.js";

function calculatePrice(basePrice, quantity, tiers = []) {
  const tier = [...tiers].sort((a, b) => b.minQuantity - a.minQuantity).find((item) => quantity >= item.minQuantity);
  const discount = tier?.discountPercent || 0;
  return Number((basePrice * (1 - discount / 100)).toFixed(2));
}

export async function createGroupBuy(payload, userId) {
  const seller = await Seller.findOne({ userId });
  if (!seller) throw new AppError("Seller profile not found", 404);

  const product = await Product.findOne({ _id: payload.productId, sellerId: seller._id });
  if (!product) throw new AppError("Product not found", 404);

  return GroupBuy.create({
    ...payload,
    sellerId: seller._id,
    title: payload.title || product.title,
    basePrice: product.price,
    currentPrice: product.price,
    currency: product.currency
  });
}

export async function listActiveGroupBuys() {
  await closeExpiredGroupBuys();
  return GroupBuy.find({ status: "active" }).populate("productId").sort({ endsAt: 1 });
}

export async function joinGroupBuy(groupBuyId, buyerId, quantity = 1) {
  const group = await GroupBuy.findById(groupBuyId);
  if (!group || group.status !== "active") throw new AppError("Active group buy not found", 404);
  if (group.endsAt <= new Date()) throw new AppError("Group buy has expired", 400);

  const existing = group.participants.find((item) => item.buyerId.toString() === buyerId.toString());
  if (existing) existing.quantity += quantity;
  else group.participants.push({ buyerId, quantity });

  group.currentQuantity = group.participants.reduce((sum, item) => sum + item.quantity, 0);
  group.currentPrice = calculatePrice(group.basePrice, group.currentQuantity, group.discountTiers);
  if (group.currentQuantity >= group.targetQuantity) group.status = "successful";
  await group.save();

  try {
    emitToRoom(`group:${group._id}`, "group_buy:updated", group);
  } catch (_error) {}

  return group;
}

export async function closeExpiredGroupBuys() {
  const expired = await GroupBuy.find({ status: "active", endsAt: { $lte: new Date() } });

  for (const group of expired) {
    group.status = group.currentQuantity >= group.targetQuantity ? "successful" : "failed";
    await group.save();
    try {
      emitToRoom(`group:${group._id}`, "group_buy:closed", group);
    } catch (_error) {}
  }

  return expired.length;
}
