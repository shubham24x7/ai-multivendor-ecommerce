import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, trim: true },
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", default: null },
    level: { type: Number, default: 0 },
    path: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
    image: {
      publicId: String,
      secureUrl: String
    },
    attributesSchema: [
      {
        name: String,
        type: { type: String, enum: ["text", "number", "boolean", "select"], default: "text" },
        required: { type: Boolean, default: false },
        options: [String]
      }
    ],
    isActive: { type: Boolean, default: true, index: true }
  },
  { timestamps: true }
);

categorySchema.index({ slug: 1 }, { unique: true });
categorySchema.index({ parentId: 1, isActive: 1 });

export const Category = mongoose.model("Category", categorySchema);
