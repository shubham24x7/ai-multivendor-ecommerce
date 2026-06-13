import Joi from "joi";

export const createReverseRequestSchema = Joi.object({
  categoryId: Joi.string().hex().length(24).optional(),
  title: Joi.string().trim().min(3).max(180).required(),
  description: Joi.string().trim().min(10).max(5000).required(),
  budgetMin: Joi.number().min(0).optional(),
  budgetMax: Joi.number().min(0).required(),
  currency: Joi.string().uppercase().length(3).default("USD"),
  quantity: Joi.number().integer().min(1).default(1),
  location: Joi.object({
    country: Joi.string().allow("", null),
    state: Joi.string().allow("", null),
    city: Joi.string().allow("", null)
  }).optional(),
  expiresAt: Joi.date().greater("now").required()
});

export const createRequestOfferSchema = Joi.object({
  requestId: Joi.string().hex().length(24).required(),
  productId: Joi.string().hex().length(24).optional(),
  price: Joi.number().min(0).required(),
  currency: Joi.string().uppercase().length(3).default("USD"),
  message: Joi.string().trim().max(2000).optional(),
  estimatedDeliveryDays: Joi.number().integer().min(0).optional()
});

export const createGroupBuySchema = Joi.object({
  productId: Joi.string().hex().length(24).required(),
  title: Joi.string().trim().max(180).optional(),
  targetQuantity: Joi.number().integer().min(2).required(),
  discountTiers: Joi.array()
    .items(
      Joi.object({
        minQuantity: Joi.number().integer().min(2).required(),
        discountPercent: Joi.number().min(0).max(90).required()
      })
    )
    .min(1)
    .required(),
  endsAt: Joi.date().greater("now").required()
});

export const joinGroupBuySchema = Joi.object({
  quantity: Joi.number().integer().min(1).default(1)
});

export const startNegotiationSchema = Joi.object({
  productId: Joi.string().hex().length(24).required(),
  amount: Joi.number().min(0).required(),
  message: Joi.string().trim().max(2000).optional()
});

export const counterNegotiationSchema = Joi.object({
  amount: Joi.number().min(0).required(),
  message: Joi.string().trim().max(2000).optional()
});

export const trackEventSchema = Joi.object({
  eventType: Joi.string().trim().min(2).max(120).required(),
  entityType: Joi.string().trim().max(80).optional(),
  entityId: Joi.string().hex().length(24).optional(),
  revenue: Joi.number().min(0).optional(),
  currency: Joi.string().uppercase().length(3).optional(),
  metadata: Joi.object().unknown(true).optional()
});
