import Joi from "joi";

export const createCategorySchema = Joi.object({
  name: Joi.string().trim().min(2).max(120).required(),
  description: Joi.string().trim().allow("", null),
  parentId: Joi.string().hex().length(24).allow(null),
  isActive: Joi.boolean().default(true)
});

export const updateCategorySchema = createCategorySchema.fork(["name"], (field) => field.optional());
