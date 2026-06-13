import { Router } from "express";
import { updateMyStore } from "../controllers/store.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { requireRoles } from "../middleware/rbac.middleware.js";
import { roles } from "../utils/rbac.js";

const router = Router();

router.patch("/me", protect, requireRoles(roles.SELLER), updateMyStore);

export default router;
