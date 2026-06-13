import mongoose from "mongoose";

const sellerSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    businessName: { type: String, required: true, trim: true },
    businessType: {
      type: String,
      enum: ["individual", "company"],
      default: "individual"
    },
    businessEmail: { type: String, trim: true, lowercase: true },
    businessPhone: { type: String, trim: true },
    taxId: { type: String, trim: true },
    kycStatus: {
      type: String,
      enum: ["not_started", "pending", "approved", "rejected"],
      default: "not_started",
      index: true
    },
    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected", "suspended"],
      default: "pending",
      index: true
    },
    rejectionReason: String,
    trustScore: { type: Number, min: 0, max: 100, default: 50 },
    trustBadge: {
      type: String,
      enum: ["bronze", "silver", "gold", "platinum"],
      default: "bronze",
      index: true
    },
    trustMetrics: {
      fulfillmentRate: { type: Number, default: 0 },
      returnRate: { type: Number, default: 0 },
      reviewScore: { type: Number, default: 0 },
      deliveryScore: { type: Number, default: 0 }
    },
    ratingAverage: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

sellerSchema.index({ userId: 1 }, { unique: true });
sellerSchema.index({ approvalStatus: 1, kycStatus: 1 });

export const Seller = mongoose.model("Seller", sellerSchema);
