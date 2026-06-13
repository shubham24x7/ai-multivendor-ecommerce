import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema(
  {
    publicId: String,
    secureUrl: String,
    altText: String,
    sortOrder: { type: Number, default: 0 }
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "Seller", required: true, index: true },
    storeId: { type: mongoose.Schema.Types.ObjectId, ref: "Store", required: true, index: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 180 },
    slug: { type: String, required: true, lowercase: true, trim: true },
    description: { type: String, trim: true, maxlength: 10000 },
    shortDescription: { type: String, trim: true, maxlength: 500 },
    brand: { type: String, trim: true },
    images: [mediaSchema],
    price: { type: Number, required: true, min: 0 },
    compareAtPrice: { type: Number, min: 0 },
    currency: { type: String, default: "USD" },
    sku: { type: String, trim: true },
    inventoryQuantity: { type: Number, default: 0, min: 0 },
    attributes: { type: Map, of: mongoose.Schema.Types.Mixed },
    status: {
      type: String,
      enum: ["draft", "pending_review", "active", "rejected", "archived"],
      default: "draft",
      index: true
    },
    rejectionReason: String,
    location: {
      mode: { type: String, enum: ["global", "hyperlocal", "both"], default: "global" },
      country: String,
      state: String,
      city: String
    }
  },
  { timestamps: true }
);

productSchema.index({ sellerId: 1, status: 1 });
productSchema.index({ categoryId: 1, status: 1 });
productSchema.index({ title: "text", description: "text" });
productSchema.index({ storeId: 1, slug: 1 }, { unique: true });

export const Product = mongoose.model("Product", productSchema);
