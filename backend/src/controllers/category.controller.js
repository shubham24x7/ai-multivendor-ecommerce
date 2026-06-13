import {
  createCategory,
  listCategories,
  updateCategory
} from "../services/category.service.js";
import { sendSuccess } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";

export const getCategories = asyncHandler(async (_req, res) => {
  const categories = await listCategories();
  sendSuccess(res, { message: "Categories fetched", data: { categories } });
});

export const createCategoryController = asyncHandler(async (req, res) => {
  const category = await createCategory(req.body);
  sendSuccess(res, {
    statusCode: 201,
    message: "Category created",
    data: { category }
  });
});

export const updateCategoryController = asyncHandler(async (req, res) => {
  const category = await updateCategory(req.params.id, req.body);
  sendSuccess(res, { message: "Category updated", data: { category } });
});
