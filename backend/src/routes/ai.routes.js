import { Router } from "express";
import {
  aiUsageLogs,
  productComparison,
  productDescription,
  reviewSummarizer,
  shoppingCopilot,
  smartSearch
} from "../controllers/ai.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { aiLimiter } from "../middleware/rate-limit.middleware.js";
import { requireRoles } from "../middleware/rbac.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { roles } from "../utils/rbac.js";
import {
  comparisonSchema,
  copilotSchema,
  productDescriptionSchema,
  reviewSummarySchema,
  smartSearchSchema
} from "../validators/ai.validator.js";

const router = Router();

router.use(protect, aiLimiter);

router.post(
  "/copilot",
  requireRoles(roles.BUYER, roles.SELLER, roles.ADMIN),
  validate(copilotSchema),
  shoppingCopilot
);
router.post(
  "/description",
  requireRoles(roles.SELLER, roles.ADMIN),
  validate(productDescriptionSchema),
  productDescription
);
router.post(
  "/compare",
  requireRoles(roles.BUYER, roles.SELLER, roles.ADMIN),
  validate(comparisonSchema),
  productComparison
);
router.post(
  "/reviews/summary",
  requireRoles(roles.BUYER, roles.SELLER, roles.ADMIN),
  validate(reviewSummarySchema),
  reviewSummarizer
);
router.post(
  "/smart-search",
  requireRoles(roles.BUYER, roles.SELLER, roles.ADMIN),
  validate(smartSearchSchema),
  smartSearch
);
router.get("/logs", requireRoles(roles.ADMIN), aiUsageLogs);

export default router;
