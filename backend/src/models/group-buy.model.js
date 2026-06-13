import mongoose from "mongoose";

const participantSchema = new mongoose.Schema(
  {
    buyerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    quantity: { type: Number, min: 1, default: 1 },
    joinedAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const groupBuySchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true, index: true },
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "Seller", required: true, index: true },
    title: { type: String, required: true, trim: true },
    basePrice: { type: Number, required: true, min: 0 },
    currentPrice: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "USD" },
    targetQuantity: { type: Number, required: true, min: 2 },
    currentQuantity: { type: Number, default: 0, min: 0 },
    discountTiers: [
      {
        minQuantity: { type: Number, required: true },
        discountPercent: { type: Number, required: true, min: 0, max: 90 }
      }
    ],
    participants: [participantSchema],
    startsAt: { type: Date, default: Date.now },
    endsAt: { type: Date, required: true, index: true },
    status: {
      type: String,
      enum: ["active", "successful", "failed", "closed", "cancelled"],
      default: "active",
      index: true
    }
  },
  { timestamps: true }
);

groupBuySchema.index({ status: 1, endsAt: 1 });

export const GroupBuy = mongoose.model("GroupBuy", groupBuySchema);
