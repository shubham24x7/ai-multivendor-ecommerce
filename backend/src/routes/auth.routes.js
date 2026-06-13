import { Router } from "express";
import { login, logout, me, refreshToken, register } from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { authLimiter } from "../middleware/rate-limit.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { loginSchema, registerSchema } from "../validators/auth.validator.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication and session management
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a buyer or seller
 *     tags: [Auth]
 */
router.post("/register", authLimiter, validate(registerSchema), register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login and create a refresh-token session
 *     tags: [Auth]
 */
router.post("/login", authLimiter, validate(loginSchema), login);

router.post("/refresh", authLimiter, refreshToken);
router.post("/logout", logout);
router.get("/me", protect, me);

export default router;
