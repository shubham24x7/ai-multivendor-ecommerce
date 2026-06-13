import { Router } from "express";
import { recalculateBySellerId, recalculateMine } from "../controllers/trust-score.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { requireRoles } from "../middleware/rbac.middleware.js";
import { roles } from "../utils/rbac.js";

const router = Router();

router.post("/me/recalculate", protect, requireRoles(roles.SELLER), recalculateMine);
router.post("/:id/recalculate", protect, requireRoles(roles.ADMIN), recalculateBySellerId);

export default router;
