import { Router } from "express";
import { createReview, getProductReviews } from "../controllers/review.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { requireRoles } from "../middleware/rbac.middleware.js";
import { roles } from "../utils/rbac.js";

const router = Router();

router.get("/product/:productId", getProductReviews);
router.post("/", protect, requireRoles(roles.BUYER), createReview);

export default router;
