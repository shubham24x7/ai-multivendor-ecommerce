import Joi from "joi";

export const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(120).required(),
  email: Joi.string().email().lowercase().required(),
  phone: Joi.string().trim().allow("", null),
  password: Joi.string().min(8).max(128).required(),
  role: Joi.string().valid("buyer", "seller").default("buyer"),
  storeName: Joi.when("role", {
    is: "seller",
    then: Joi.string().trim().min(2).max(140).required(),
    otherwise: Joi.string().trim().optional()
  }),
  businessName: Joi.when("role", {
    is: "seller",
    then: Joi.string().trim().min(2).max(140).required(),
    otherwise: Joi.string().trim().optional()
  })
});

export const loginSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().required()
});

export const refreshSchema = Joi.object({});
