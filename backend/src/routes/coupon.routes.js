import { Router } from "express";
import { createCoupon, listCoupons } from "../controllers/coupon.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { requireRoles } from "../middleware/rbac.middleware.js";
import { roles } from "../utils/rbac.js";

const router = Router();

router.get("/", protect, requireRoles(roles.ADMIN), listCoupons);
router.post("/", protect, requireRoles(roles.ADMIN), createCoupon);

export default router;
