import { Router } from "express";
import {
  approveSellerById,
  getMySellerProfile,
  rejectSellerById,
  updateMySellerProfile
} from "../controllers/seller.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { requireRoles } from "../middleware/rbac.middleware.js";
import { roles } from "../utils/rbac.js";

const router = Router();

router.get("/me", protect, requireRoles(roles.SELLER), getMySellerProfile);
router.patch("/me", protect, requireRoles(roles.SELLER), updateMySellerProfile);
router.patch("/:id/approve", protect, requireRoles(roles.ADMIN), approveSellerById);
router.patch("/:id/reject", protect, requireRoles(roles.ADMIN), rejectSellerById);

export default router;
