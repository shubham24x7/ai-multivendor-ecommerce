import { Router } from "express";
import adminRoutes from "./admin.routes.js";
import aiRoutes from "./ai.routes.js";
import analyticsRoutes from "./analytics.routes.js";
import authRoutes from "./auth.routes.js";
import categoryRoutes from "./category.routes.js";
import couponRoutes from "./coupon.routes.js";
import notificationRoutes from "./notification.routes.js";
import orderRoutes from "./order.routes.js";
import paymentRoutes from "./payment.routes.js";
import productRoutes from "./product.routes.js";
import reviewRoutes from "./review.routes.js";
import reverseMarketplaceRoutes from "./reverse-marketplace.routes.js";
import groupBuyRoutes from "./group-buy.routes.js";
import negotiationRoutes from "./negotiation.routes.js";
import sellerRoutes from "./seller.routes.js";
import storeRoutes from "./store.routes.js";
import transactionRoutes from "./transaction.routes.js";
import uploadRoutes from "./upload.routes.js";
import userRoutes from "./user.routes.js";
import trustScoreRoutes from "./trust-score.routes.js";

const router = Router();

router.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "AI Multivendor Ecommerce API v1"
  });
});

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/sellers", sellerRoutes);
router.use("/stores", storeRoutes);
router.use("/categories", categoryRoutes);
router.use("/products", productRoutes);
router.use("/uploads", uploadRoutes);
router.use("/notifications", notificationRoutes);
router.use("/admin", adminRoutes);
router.use("/ai", aiRoutes);
router.use("/payments", paymentRoutes);
router.use("/reverse-marketplace", reverseMarketplaceRoutes);
router.use("/group-buys", groupBuyRoutes);
router.use("/negotiations", negotiationRoutes);
router.use("/analytics", analyticsRoutes);
router.use("/trust-score", trustScoreRoutes);
router.use("/orders", orderRoutes);
router.use("/reviews", reviewRoutes);
router.use("/coupons", couponRoutes);
router.use("/transactions", transactionRoutes);

export default router;
