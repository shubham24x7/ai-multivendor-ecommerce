import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import mongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";
import hpp from "hpp";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import xss from "xss-clean";
import { env } from "./config/env.js";
import { swaggerSpec } from "./config/swagger.js";
import { errorHandler } from "./middleware/error.middleware.js";
import { notFoundHandler } from "./middleware/not-found.middleware.js";
import { apiLimiter } from "./middleware/rate-limit.middleware.js";
import routes from "./routes/index.js";

export function createApp() {
  const app = express();

  app.set("trust proxy", 1);
  app.use(helmet());
  app.use(
    cors({
      origin: env.clientUrl,
      credentials: true
    })
  );
  app.use(compression());
  app.use("/api/v1/payments/webhooks/stripe", express.raw({ type: "application/json" }));
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true, limit: "1mb" }));
  app.use(cookieParser());
  app.use(mongoSanitize());
  app.use(xss());
  app.use(hpp());
  app.use(apiLimiter);

  if (!env.isProduction) {
    app.use(morgan("dev"));
  }

  app.get("/health", (_req, res) => {
    res.status(200).json({
      success: true,
      message: "Backend is healthy",
      timestamp: new Date().toISOString()
    });
  });

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.use("/api/v1", routes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
