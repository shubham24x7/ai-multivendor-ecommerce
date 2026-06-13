import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", index: true },
    buyerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "Seller", index: true },
    type: {
      type: String,
      enum: ["payment", "refund", "commission", "payout", "adjustment"],
      required: true,
      index: true
    },
    provider: {
      type: String,
      enum: ["stripe", "razorpay", "paypal", "manual", "none"],
      default: "none"
    },
    providerTransactionId: String,
    providerOrderId: String,
    providerRefundId: String,
    idempotencyKey: String,
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    status: {
      type: String,
      enum: ["created", "pending", "completed", "failed", "cancelled"],
      default: "created",
      index: true
    },
    metadata: { type: Map, of: mongoose.Schema.Types.Mixed }
  },
  { timestamps: true }
);

transactionSchema.index({ provider: 1, providerTransactionId: 1 });

export const Transaction = mongoose.model("Transaction", transactionSchema);
