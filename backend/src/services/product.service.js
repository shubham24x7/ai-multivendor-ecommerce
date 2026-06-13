import { Product } from "../models/product.model.js";
import { Seller } from "../models/seller.model.js";
import { Store } from "../models/store.model.js";
import { AppError } from "../utils/app-error.js";
import { createSlug } from "../utils/slug.js";

export async function listPublicProducts(query) {
  const filter = { status: "active" };
  if (query.search) {
    filter.$text = { $search: query.search };
  }

  const page = Number(query.page || 1);
  const limit = Number(query.limit || 20);

  const [items, total] = await Promise.all([
    Product.find(filter)
      .populate("storeId", "name slug")
      .populate("categoryId", "name slug")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Product.countDocuments(filter)
  ]);

  return { items, page, limit, total };
}

export async function getPublicProductBySlug(slug) {
  const product = await Product.findOne({ slug, status: "active" })
    .populate("storeId", "name slug")
    .populate("categoryId", "name slug");

  if (!product) throw new AppError("Product not found", 404);
  return product;
}

export async function listSellerProducts(userId) {
  const seller = await Seller.findOne({ userId });
  if (!seller) throw new AppError("Seller profile not found", 404);
  return Product.find({ sellerId: seller._id }).sort({ createdAt: -1 });
}

export async function createSellerProduct(userId, payload) {
  const seller = await Seller.findOne({ userId });
  if (!seller) throw new AppError("Seller profile not found", 404);
  if (seller.approvalStatus !== "approved") {
    throw new AppError("Seller must be approved before creating products", 403);
  }

  const store = await Store.findOne({ sellerId: seller._id });
  if (!store) throw new AppError("Store not found", 404);

  return Product.create({
    ...payload,
    sellerId: seller._id,
    storeId: store._id,
    slug: `${createSlug(payload.title)}-${Date.now().toString(36)}`,
    status: "draft"
  });
}

export async function updateSellerProduct(userId, productId, payload) {
  const seller = await Seller.findOne({ userId });
  if (!seller) throw new AppError("Seller profile not found", 404);

  const update = { ...payload };
  if (payload.title) update.slug = `${createSlug(payload.title)}-${Date.now().toString(36)}`;

  const product = await Product.findOneAndUpdate(
    { _id: productId, sellerId: seller._id },
    update,
    { new: true, runValidators: true }
  );

  if (!product) throw new AppError("Product not found", 404);
  return product;
}

export async function submitProductForReview(userId, productId) {
  const seller = await Seller.findOne({ userId });
  if (!seller) throw new AppError("Seller profile not found", 404);

  const product = await Product.findOneAndUpdate(
    { _id: productId, sellerId: seller._id },
    { status: "pending_review" },
    { new: true, runValidators: true }
  );

  if (!product) throw new AppError("Product not found", 404);
  return product;
}

export async function approveProduct(productId) {
  const product = await Product.findByIdAndUpdate(
    productId,
    { status: "active", rejectionReason: null },
    { new: true, runValidators: true }
  );
  if (!product) throw new AppError("Product not found", 404);
  return product;
}

export async function rejectProduct(productId, rejectionReason) {
  const product = await Product.findByIdAndUpdate(
    productId,
    { status: "rejected", rejectionReason },
    { new: true, runValidators: true }
  );
  if (!product) throw new AppError("Product not found", 404);
  return product;
}
