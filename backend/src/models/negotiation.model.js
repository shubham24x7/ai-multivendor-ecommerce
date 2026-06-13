import mongoose from "mongoose";

const negotiationMessageSchema = new mongoose.Schema(
  {
    actorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    actorRole: { type: String, enum: ["buyer", "seller", "admin", "ai"], required: true },
    type: { type: String, enum: ["message", "offer", "counter", "ai_suggestion", "accepted", "rejected"], required: true },
    amount: { type: Number, min: 0 },
    currency: String,
    message: { type: String, trim: true, maxlength: 2000 },
    createdAt: { type: Date, default: Date.now }
  },
  { _id: true }
);

const negotiationSchema = new mongoose.Schema(
  {
    buyerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "Seller", required: true, index: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true, index: true },
    currency: { type: String, default: "USD" },
    currentOffer: { type: Number, min: 0 },
    sellerMinimumPrice: { type: Number, min: 0 },
    history: [negotiationMessageSchema],
    status: {
      type: String,
      enum: ["active", "accepted", "rejected", "expired", "cancelled"],
      default: "active",
      index: true
    }
  },
  { timestamps: true }
);

negotiationSchema.index({ buyerId: 1, productId: 1, status: 1 });

export const Negotiation = mongoose.model("Negotiation", negotiationSchema);
