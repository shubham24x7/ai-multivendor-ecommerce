import { Router } from "express";
import { getMyNotifications, markRead } from "../controllers/notification.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.use(protect);
router.get("/", getMyNotifications);
router.patch("/:id/read", markRead);

export default router;
