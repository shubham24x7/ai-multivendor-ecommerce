import mongoose from "mongoose";

const analyticsEventSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    role: { type: String, enum: ["buyer", "seller", "admin", "public"], default: "public" },
    eventType: { type: String, required: true, index: true },
    entityType: String,
    entityId: mongoose.Schema.Types.ObjectId,
    revenue: { type: Number, default: 0 },
    currency: String,
    metadata: { type: Map, of: mongoose.Schema.Types.Mixed }
  },
  { timestamps: true }
);

analyticsEventSchema.index({ eventType: 1, createdAt: -1 });
analyticsEventSchema.index({ userId: 1, createdAt: -1 });

export const AnalyticsEvent = mongoose.model("AnalyticsEvent", analyticsEventSchema);
