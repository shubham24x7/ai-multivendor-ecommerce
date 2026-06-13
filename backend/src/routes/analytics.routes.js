import { Router } from "express";
import { admin, buyer, seller, track } from "../controllers/analytics.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { requireRoles } from "../middleware/rbac.middleware.js";
import { roles } from "../utils/rbac.js";
import { validate } from "../middleware/validate.middleware.js";
import { trackEventSchema } from "../validators/marketplace.validator.js";

const router = Router();

router.post("/events", protect, validate(trackEventSchema), track);
router.get("/buyer", protect, requireRoles(roles.BUYER), buyer);
router.get("/seller", protect, requireRoles(roles.SELLER), seller);
router.get("/admin", protect, requireRoles(roles.ADMIN), admin);

export default router;
