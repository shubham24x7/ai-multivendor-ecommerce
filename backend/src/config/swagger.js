import swaggerJSDoc from "swagger-jsdoc";
import { env } from "./env.js";

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "AI Multivendor Ecommerce API",
      version: "1.0.0",
      description: "Backend foundation API for buyer, seller, and admin marketplace operations."
    },
    servers: [
      {
        url: env.swaggerServerUrl
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    }
  },
  apis: ["./src/routes/*.js", "./src/models/*.js"]
});
