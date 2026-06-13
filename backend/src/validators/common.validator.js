import Joi from "joi";

export const mongoIdParamSchema = Joi.object({
  id: Joi.string().hex().length(24).required()
});

export const paginationQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  search: Joi.string().trim().allow("", null)
});
