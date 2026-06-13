import Joi from "joi";

export const createProductSchema = Joi.object({
  categoryId: Joi.string().hex().length(24).required(),
  title: Joi.string().trim().min(2).max(180).required(),
  description: Joi.string().trim().allow("", null),
  shortDescription: Joi.string().trim().max(500).allow("", null),
  brand: Joi.string().trim().allow("", null),
  price: Joi.number().min(0).required(),
  compareAtPrice: Joi.number().min(0).optional(),
  currency: Joi.string().uppercase().length(3).default("USD"),
  sku: Joi.string().trim().allow("", null),
  inventoryQuantity: Joi.number().integer().min(0).default(0),
  attributes: Joi.object().unknown(true).default({}),
  location: Joi.object({
    mode: Joi.string().valid("global", "hyperlocal", "both").default("global"),
    country: Joi.string().allow("", null),
    state: Joi.string().allow("", null),
    city: Joi.string().allow("", null)
  }).default({ mode: "global" })
});

export const updateProductSchema = createProductSchema.fork(["categoryId", "title", "price"], (field) =>
  field.optional()
);
