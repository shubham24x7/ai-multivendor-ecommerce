import { Router } from "express";
import {
  acceptOffer,
  compareOffers,
  createOffer,
  createRequest,
  getOpenRequests
} from "../controllers/reverse-marketplace.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { requireRoles } from "../middleware/rbac.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { roles } from "../utils/rbac.js";
import {
  createRequestOfferSchema,
  createReverseRequestSchema
} from "../validators/marketplace.validator.js";

const router = Router();

router.get("/requests", protect, requireRoles(roles.SELLER, roles.ADMIN), getOpenRequests);
router.post("/requests", protect, requireRoles(roles.BUYER), validate(createReverseRequestSchema), createRequest);
router.post("/offers", protect, requireRoles(roles.SELLER), validate(createRequestOfferSchema), createOffer);
router.get("/requests/:id/offers", protect, requireRoles(roles.BUYER), compareOffers);
router.patch("/requests/:id/offers/:offerId/accept", protect, requireRoles(roles.BUYER), acceptOffer);

export default router;
