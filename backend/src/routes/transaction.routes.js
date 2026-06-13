import { Router } from "express";
import { listTransactions } from "../controllers/transaction.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { requireRoles } from "../middleware/rbac.middleware.js";
import { roles } from "../utils/rbac.js";

const router = Router();

router.get("/", protect, requireRoles(roles.ADMIN), listTransactions);

export default router;
