import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, uppercase: true, trim: true, unique: true },
    description: String,
    discountType: { type: String, enum: ["percentage", "fixed"], required: true },
    discountValue: { type: Number, required: true, min: 0 },
    maxDiscountAmount: { type: Number, min: 0 },
    minOrderAmount: { type: Number, default: 0 },
    currency: { type: String, default: "USD" },
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "Seller", default: null },
    usageLimit: { type: Number, default: null },
    usedCount: { type: Number, default: 0 },
    startsAt: Date,
    expiresAt: Date,
    status: { type: String, enum: ["active", "inactive", "expired"], default: "active", index: true }
  },
  { timestamps: true }
);

couponSchema.index({ code: 1 }, { unique: true });
couponSchema.index({ sellerId: 1, status: 1 });

export const Coupon = mongoose.model("Coupon", couponSchema);
