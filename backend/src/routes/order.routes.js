import { Router } from "express";
import { getAllOrders, getMyOrders } from "../controllers/order.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { requireRoles } from "../middleware/rbac.middleware.js";
import { roles } from "../utils/rbac.js";

const router = Router();

router.get("/me", protect, requireRoles(roles.BUYER), getMyOrders);
router.get("/", protect, requireRoles(roles.ADMIN), getAllOrders);

export default router;
