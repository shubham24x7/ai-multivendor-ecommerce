import { Router } from "express";
import {
  approveProductById,
  createProduct,
  getMyProducts,
  getProductBySlug,
  getProducts,
  rejectProductById,
  submitProduct,
  updateProduct
} from "../controllers/product.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { requireRoles } from "../middleware/rbac.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { roles } from "../utils/rbac.js";
import { createProductSchema, updateProductSchema } from "../validators/product.validator.js";

const router = Router();

router.get("/", getProducts);
router.get("/seller/me", protect, requireRoles(roles.SELLER), getMyProducts);
router.post("/", protect, requireRoles(roles.SELLER), validate(createProductSchema), createProduct);
router.patch("/:id", protect, requireRoles(roles.SELLER), validate(updateProductSchema), updateProduct);
router.patch("/:id/submit", protect, requireRoles(roles.SELLER), submitProduct);
router.patch("/:id/approve", protect, requireRoles(roles.ADMIN), approveProductById);
router.patch("/:id/reject", protect, requireRoles(roles.ADMIN), rejectProductById);
router.get("/:slug", getProductBySlug);

export default router;
