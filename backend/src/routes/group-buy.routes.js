import { Router } from "express";
import {
  closeExpiredGroups,
  createGroup,
  getGroups,
  joinGroup
} from "../controllers/group-buy.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { requireRoles } from "../middleware/rbac.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { roles } from "../utils/rbac.js";
import { createGroupBuySchema, joinGroupBuySchema } from "../validators/marketplace.validator.js";

const router = Router();

router.get("/", getGroups);
router.post("/", protect, requireRoles(roles.SELLER), validate(createGroupBuySchema), createGroup);
router.post("/:id/join", protect, requireRoles(roles.BUYER), validate(joinGroupBuySchema), joinGroup);
router.post("/close-expired", protect, requireRoles(roles.ADMIN), closeExpiredGroups);

export default router;
