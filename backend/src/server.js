import http from "http";
import { createApp } from "./app.js";
import { connectDatabase, disconnectDatabase } from "./config/database.js";
import { env } from "./config/env.js";
import { initializeSocket } from "./sockets/index.js";

const app = createApp();
const server = http.createServer(app);

initializeSocket(server);

async function startServer() {
  await connectDatabase();

  server.listen(env.port, () => {
    console.log(`API server running on port ${env.port}`);
    console.log(`Swagger docs available at http://localhost:${env.port}/api-docs`);
  });
}

function shutdown(signal) {
  console.log(`${signal} received. Shutting down gracefully...`);
  server.close(async () => {
    await disconnectDatabase();
    process.exit(0);
  });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
