import mongoose from "mongoose";
import { roles } from "../utils/rbac.js";

const addressSchema = new mongoose.Schema(
  {
    label: { type: String, trim: true },
    fullName: { type: String, trim: true },
    phone: { type: String, trim: true },
    line1: { type: String, trim: true },
    line2: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    country: { type: String, trim: true },
    postalCode: { type: String, trim: true },
    isDefault: { type: Boolean, default: false }
  },
  { _id: true }
);

const refreshSessionSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true },
    tokenHash: { type: String, required: true },
    userAgent: String,
    ipAddress: String,
    expiresAt: { type: Date, required: true },
    revokedAt: Date,
    createdAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    phone: { type: String, trim: true, sparse: true },
    passwordHash: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: Object.values(roles),
      default: roles.BUYER,
      index: true
    },
    status: {
      type: String,
      enum: ["active", "pending", "suspended", "deleted"],
      default: "active",
      index: true
    },
    emailVerified: { type: Boolean, default: false },
    phoneVerified: { type: Boolean, default: false },
    avatar: {
      publicId: String,
      secureUrl: String
    },
    preferredLanguage: { type: String, default: "en" },
    preferredCurrency: { type: String, default: "USD" },
    addresses: [addressSchema],
    refreshSessions: [refreshSessionSchema],
    lastLoginAt: Date
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        delete ret.passwordHash;
        delete ret.refreshSessions;
        return ret;
      }
    }
  }
);

userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ role: 1, status: 1 });

export const User = mongoose.model("User", userSchema);
