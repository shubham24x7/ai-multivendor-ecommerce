import { Router } from "express";
import {
  createCategoryController,
  getCategories,
  updateCategoryController
} from "../controllers/category.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { requireRoles } from "../middleware/rbac.middleware.js";
import { roles } from "../utils/rbac.js";
import { validate } from "../middleware/validate.middleware.js";
import { createCategorySchema, updateCategorySchema } from "../validators/category.validator.js";

const router = Router();

router.get("/", getCategories);
router.post("/", protect, requireRoles(roles.ADMIN), validate(createCategorySchema), createCategoryController);
router.patch("/:id", protect, requireRoles(roles.ADMIN), validate(updateCategorySchema), updateCategoryController);

export default router;
