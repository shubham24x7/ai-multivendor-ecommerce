import { Negotiation } from "../models/negotiation.model.js";
import { Product } from "../models/product.model.js";
import { Seller } from "../models/seller.model.js";
import { AppError } from "../utils/app-error.js";
import { emitToUser } from "../sockets/index.js";

function suggestPrice(productPrice, currentOffer, trustScore = 50) {
  const floor = productPrice * 0.85;
  const trustAdjustment = trustScore >= 80 ? 0.97 : 0.94;
  const midpoint = (Number(currentOffer) + productPrice) / 2;
  return Number(Math.max(floor, midpoint * trustAdjustment).toFixed(2));
}

export async function startNegotiation(payload, buyerId) {
  const product = await Product.findById(payload.productId);
  if (!product || product.status !== "active") throw new AppError("Active product not found", 404);

  const negotiation = await Negotiation.create({
    buyerId,
    sellerId: product.sellerId,
    productId: product._id,
    currency: product.currency,
    currentOffer: payload.amount,
    history: [
      {
        actorId: buyerId,
        actorRole: "buyer",
        type: "offer",
        amount: payload.amount,
        currency: product.currency,
        message: payload.message
      }
    ]
  });

  try {
    const seller = await Seller.findById(product.sellerId);
    emitToUser(seller.userId.toString(), "negotiation:created", negotiation);
  } catch (_error) {}

  return negotiation;
}

export async function counterNegotiation(negotiationId, payload, user) {
  const negotiation = await Negotiation.findById(negotiationId);
  if (!negotiation || negotiation.status !== "active") throw new AppError("Active negotiation not found", 404);

  negotiation.currentOffer = payload.amount;
  negotiation.history.push({
    actorId: user._id,
    actorRole: user.role,
    type: user.role === "seller" ? "counter" : "offer",
    amount: payload.amount,
    currency: negotiation.currency,
    message: payload.message
  });

  await negotiation.save();

  try {
    emitToUser(negotiation.buyerId.toString(), "negotiation:updated", negotiation);
  } catch (_error) {}

  return negotiation;
}

export async function getNegotiationSuggestion(negotiationId) {
  const negotiation = await Negotiation.findById(negotiationId).populate("productId").populate("sellerId");
  if (!negotiation) throw new AppError("Negotiation not found", 404);

  const suggestedPrice = suggestPrice(
    negotiation.productId.price,
    negotiation.currentOffer,
    negotiation.sellerId.trustScore
  );

  negotiation.history.push({
    actorRole: "ai",
    type: "ai_suggestion",
    amount: suggestedPrice,
    currency: negotiation.currency,
    message: "AI-assisted suggestion based on listed price, current offer, and seller trust score."
  });
  await negotiation.save();

  return {
    suggestedPrice,
    reasoning: "Balances buyer discount intent with seller price floor and trust score.",
    negotiation
  };
}

export async function closeNegotiation(negotiationId, status, user) {
  const negotiation = await Negotiation.findById(negotiationId);
  if (!negotiation) throw new AppError("Negotiation not found", 404);

  negotiation.status = status;
  negotiation.history.push({
    actorId: user._id,
    actorRole: user.role,
    type: status === "accepted" ? "accepted" : "rejected",
    message: `Negotiation ${status}`
  });
  await negotiation.save();
  return negotiation;
}
