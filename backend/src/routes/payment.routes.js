import { Router } from "express";
import {
  createIntent,
  paypalWebhook,
  razorpayWebhook,
  refund,
  stripeWebhook
} from "../controllers/payment.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { requireRoles } from "../middleware/rbac.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { roles } from "../utils/rbac.js";
import { createPaymentIntentSchema, refundSchema } from "../validators/payment.validator.js";

const router = Router();

router.post("/intents", protect, requireRoles(roles.BUYER, roles.ADMIN), validate(createPaymentIntentSchema), createIntent);
router.post("/transactions/:id/refund", protect, requireRoles(roles.ADMIN), validate(refundSchema), refund);
router.post("/webhooks/stripe", stripeWebhook);
router.post("/webhooks/razorpay", razorpayWebhook);
router.post("/webhooks/paypal", paypalWebhook);

export default router;
