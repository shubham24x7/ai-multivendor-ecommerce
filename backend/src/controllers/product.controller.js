import {
  approveProduct,
  createSellerProduct,
  getPublicProductBySlug,
  listPublicProducts,
  listSellerProducts,
  rejectProduct,
  submitProductForReview,
  updateSellerProduct
} from "../services/product.service.js";
import { sendSuccess } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";

export const getProducts = asyncHandler(async (req, res) => {
  const result = await listPublicProducts(req.query);
  sendSuccess(res, {
    message: "Products fetched",
    data: result.items,
    meta: {
      page: result.page,
      limit: result.limit,
      total: result.total
    }
  });
});

export const getProductBySlug = asyncHandler(async (req, res) => {
  const product = await getPublicProductBySlug(req.params.slug);
  sendSuccess(res, { message: "Product fetched", data: { product } });
});

export const getMyProducts = asyncHandler(async (req, res) => {
  const products = await listSellerProducts(req.user._id);
  sendSuccess(res, { message: "Seller products fetched", data: { products } });
});

export const createProduct = asyncHandler(async (req, res) => {
  const product = await createSellerProduct(req.user._id, req.body);
  sendSuccess(res, {
    statusCode: 201,
    message: "Product created",
    data: { product }
  });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await updateSellerProduct(req.user._id, req.params.id, req.body);
  sendSuccess(res, { message: "Product updated", data: { product } });
});

export const submitProduct = asyncHandler(async (req, res) => {
  const product = await submitProductForReview(req.user._id, req.params.id);
  sendSuccess(res, { message: "Product submitted for review", data: { product } });
});

export const approveProductById = asyncHandler(async (req, res) => {
  const product = await approveProduct(req.params.id);
  sendSuccess(res, { message: "Product approved", data: { product } });
});

export const rejectProductById = asyncHandler(async (req, res) => {
  const product = await rejectProduct(req.params.id, req.body.rejectionReason);
  sendSuccess(res, { message: "Product rejected", data: { product } });
});
