import mongoose from "mongoose";

const reverseRequestSchema = new mongoose.Schema(
  {
    buyerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    title: { type: String, required: true, trim: true, maxlength: 180 },
    description: { type: String, required: true, trim: true, maxlength: 5000 },
    budgetMin: { type: Number, min: 0 },
    budgetMax: { type: Number, min: 0 },
    currency: { type: String, default: "USD" },
    quantity: { type: Number, min: 1, default: 1 },
    location: {
      country: String,
      state: String,
      city: String
    },
    expiresAt: { type: Date, required: true, index: true },
    status: {
      type: String,
      enum: ["open", "accepted", "closed", "expired", "cancelled"],
      default: "open",
      index: true
    },
    acceptedOfferId: { type: mongoose.Schema.Types.ObjectId, ref: "RequestOffer" }
  },
  { timestamps: true }
);

reverseRequestSchema.index({ status: 1, expiresAt: 1 });
reverseRequestSchema.index({ title: "text", description: "text" });

export const ReverseRequest = mongoose.model("ReverseRequest", reverseRequestSchema);
