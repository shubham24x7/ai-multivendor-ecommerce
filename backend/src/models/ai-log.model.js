import mongoose from "mongoose";

const aiLogSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    role: { type: String, enum: ["buyer", "seller", "admin", "public"], default: "public" },
    feature: {
      type: String,
      enum: ["shopping_copilot", "description_generator", "product_comparison", "review_summarizer", "smart_search"],
      required: true,
      index: true
    },
    provider: { type: String, enum: ["openai", "gemini"], required: true, index: true },
    model: String,
    promptVersion: { type: String, default: "v1" },
    inputMetadata: { type: Map, of: mongoose.Schema.Types.Mixed },
    outputMetadata: { type: Map, of: mongoose.Schema.Types.Mixed },
    tokenUsage: {
      inputTokens: Number,
      outputTokens: Number,
      totalTokens: Number
    },
    latencyMs: Number,
    status: { type: String, enum: ["success", "failed"], required: true, index: true },
    errorMessage: String
  },
  { timestamps: true }
);

aiLogSchema.index({ userId: 1, feature: 1, createdAt: -1 });
aiLogSchema.index({ provider: 1, status: 1, createdAt: -1 });

export const AiLog = mongoose.model("AiLog", aiLogSchema);
