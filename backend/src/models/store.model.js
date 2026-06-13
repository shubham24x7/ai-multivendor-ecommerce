import mongoose from "mongoose";

const serviceAreaSchema = new mongoose.Schema(
  {
    name: String,
    country: String,
    state: String,
    city: String,
    postalCodes: [String]
  },
  { _id: false }
);

const storeSchema = new mongoose.Schema(
  {
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "Seller", required: true, unique: true },
    name: { type: String, required: true, trim: true, maxlength: 140 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, trim: true, maxlength: 2000 },
    logo: {
      publicId: String,
      secureUrl: String
    },
    banner: {
      publicId: String,
      secureUrl: String
    },
    defaultCurrency: { type: String, default: "USD" },
    supportedLanguages: { type: [String], default: ["en"] },
    pickupAddress: {
      line1: String,
      line2: String,
      city: String,
      state: String,
      country: String,
      postalCode: String
    },
    serviceAreas: [serviceAreaSchema],
    status: {
      type: String,
      enum: ["draft", "active", "suspended"],
      default: "draft",
      index: true
    }
  },
  { timestamps: true }
);

storeSchema.index({ slug: 1 }, { unique: true });
storeSchema.index({ sellerId: 1 }, { unique: true });
storeSchema.index({ status: 1 });

export const Store = mongoose.model("Store", storeSchema);
