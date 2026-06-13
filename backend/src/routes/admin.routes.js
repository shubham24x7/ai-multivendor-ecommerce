import { Router } from "express";
import {
  getAdminDashboard,
  listPendingProducts,
  listSellers,
  listUsers
} from "../controllers/admin.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { requireRoles } from "../middleware/rbac.middleware.js";
import { roles } from "../utils/rbac.js";

const router = Router();

router.use(protect, requireRoles(roles.ADMIN));
router.get("/dashboard", getAdminDashboard);
router.get("/users", listUsers);
router.get("/sellers", listSellers);
router.get("/products/pending", listPendingProducts);

export default router;
