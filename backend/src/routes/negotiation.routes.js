import { Router } from "express";
import { accept, counter, reject, start, suggest } from "../controllers/negotiation.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { requireRoles } from "../middleware/rbac.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { roles } from "../utils/rbac.js";
import {
  counterNegotiationSchema,
  startNegotiationSchema
} from "../validators/marketplace.validator.js";

const router = Router();

router.post("/", protect, requireRoles(roles.BUYER), validate(startNegotiationSchema), start);
router.post("/:id/counter", protect, requireRoles(roles.BUYER, roles.SELLER), validate(counterNegotiationSchema), counter);
router.post("/:id/suggest", protect, requireRoles(roles.BUYER, roles.SELLER, roles.ADMIN), suggest);
router.patch("/:id/accept", protect, requireRoles(roles.BUYER, roles.SELLER), accept);
router.patch("/:id/reject", protect, requireRoles(roles.BUYER, roles.SELLER), reject);

export default router;
