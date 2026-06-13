import { Product } from "../models/product.model.js";
import { Seller } from "../models/seller.model.js";
import { User } from "../models/user.model.js";
import { sendSuccess } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";

export const getAdminDashboard = asyncHandler(async (_req, res) => {
  const [users, sellersPending, productsPending, productsActive] = await Promise.all([
    User.countDocuments(),
    Seller.countDocuments({ approvalStatus: "pending" }),
    Product.countDocuments({ status: "pending_review" }),
    Product.countDocuments({ status: "active" })
  ]);

  sendSuccess(res, {
    message: "Admin dashboard fetched",
    data: {
      users,
      sellersPending,
      productsPending,
      productsActive
    }
  });
});

export const listUsers = asyncHandler(async (_req, res) => {
  const users = await User.find().sort({ createdAt: -1 }).limit(100);
  sendSuccess(res, { message: "Users fetched", data: { users } });
});

export const listSellers = asyncHandler(async (_req, res) => {
  const sellers = await Seller.find().populate("userId", "name email phone status").sort({ createdAt: -1 });
  sendSuccess(res, { message: "Sellers fetched", data: { sellers } });
});

export const listPendingProducts = asyncHandler(async (_req, res) => {
  const products = await Product.find({ status: "pending_review" })
    .populate("sellerId")
    .populate("storeId", "name slug")
    .sort({ updatedAt: -1 });

  sendSuccess(res, { message: "Pending products fetched", data: { products } });
});
