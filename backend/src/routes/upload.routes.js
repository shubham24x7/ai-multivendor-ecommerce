import { Router } from "express";
import { uploadSingleImage } from "../controllers/upload.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";

const router = Router();

router.post("/image", protect, upload.single("image"), uploadSingleImage);

export default router;
