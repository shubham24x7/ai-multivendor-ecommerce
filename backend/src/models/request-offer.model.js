import mongoose from "mongoose";

const requestOfferSchema = new mongoose.Schema(
  {
    requestId: { type: mongoose.Schema.Types.ObjectId, ref: "ReverseRequest", required: true, index: true },
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "Seller", required: true, index: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    price: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "USD" },
    message: { type: String, trim: true, maxlength: 2000 },
    estimatedDeliveryDays: { type: Number, min: 0 },
    status: {
      type: String,
      enum: ["submitted", "accepted", "rejected", "withdrawn"],
      default: "submitted",
      index: true
    }
  },
  { timestamps: true }
);

requestOfferSchema.index({ requestId: 1, sellerId: 1 }, { unique: true });

export const RequestOffer = mongoose.model("RequestOffer", requestOfferSchema);
