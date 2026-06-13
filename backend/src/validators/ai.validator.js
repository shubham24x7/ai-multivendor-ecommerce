import Joi from "joi";

const provider = Joi.string().valid("openai", "gemini").optional();

export const productDescriptionSchema = Joi.object({
  provider,
  productName: Joi.string().trim().min(2).max(180).required(),
  category: Joi.string().trim().min(2).max(120).required(),
  features: Joi.array().items(Joi.string().trim().min(1).max(160)).min(1).max(20).required(),
  tone: Joi.string().trim().max(120).optional()
});

export const copilotSchema = Joi.object({
  provider,
  query: Joi.string().trim().min(3).max(800).required()
});

export const smartSearchSchema = Joi.object({
  provider,
  query: Joi.string().trim().min(3).max(500).required()
});

export const comparisonSchema = Joi.object({
  provider,
  productIds: Joi.array().items(Joi.string().hex().length(24)).min(2).max(5).required()
});

export const reviewSummarySchema = Joi.object({
  provider,
  productId: Joi.string().hex().length(24).required()
});
