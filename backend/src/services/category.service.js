import { Category } from "../models/category.model.js";
import { AppError } from "../utils/app-error.js";
import { createSlug } from "../utils/slug.js";

export async function listCategories() {
  return Category.find({ isActive: true }).sort({ name: 1 });
}

export async function createCategory(payload) {
  const parent = payload.parentId ? await Category.findById(payload.parentId) : null;
  if (payload.parentId && !parent) throw new AppError("Parent category not found", 404);

  return Category.create({
    ...payload,
    slug: createSlug(payload.name),
    level: parent ? parent.level + 1 : 0,
    path: parent ? [...parent.path, parent._id] : []
  });
}

export async function updateCategory(id, payload) {
  const update = { ...payload };
  if (payload.name) update.slug = createSlug(payload.name);

  const category = await Category.findByIdAndUpdate(id, update, {
    new: true,
    runValidators: true
  });

  if (!category) throw new AppError("Category not found", 404);
  return category;
}
