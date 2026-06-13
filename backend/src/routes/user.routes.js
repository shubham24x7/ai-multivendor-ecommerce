import { Router } from "express";
import { getMe, updateMe } from "../controllers/user.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.use(protect);
router.get("/me", getMe);
router.patch("/me", updateMe);

export default router;
