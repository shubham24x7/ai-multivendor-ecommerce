import Joi from "joi";

export const createPaymentIntentSchema = Joi.object({
  provider: Joi.string().valid("stripe", "razorpay", "paypal").required(),
  orderId: Joi.string().hex().length(24).optional(),
  amount: Joi.number().min(0).when("orderId", { is: Joi.exist(), then: Joi.optional(), otherwise: Joi.required() }),
  currency: Joi.string().uppercase().length(3).when("orderId", { is: Joi.exist(), then: Joi.optional(), otherwise: Joi.required() })
});

export const refundSchema = Joi.object({
  amount: Joi.number().min(0).optional(),
  reason: Joi.string().trim().max(500).optional()
});
