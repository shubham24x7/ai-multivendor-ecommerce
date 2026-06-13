import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    buyerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "Seller", required: true, index: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true, index: true },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, trim: true, maxlength: 160 },
    comment: { type: String, trim: true, maxlength: 5000 },
    status: {
      type: String,
      enum: ["pending", "published", "rejected"],
      default: "published",
      index: true
    },
    helpfulCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

reviewSchema.index({ buyerId: 1, productId: 1, orderId: 1 }, { unique: true, sparse: true });

export const Review = mongoose.model("Review", reviewSchema);
