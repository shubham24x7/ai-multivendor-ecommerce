import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

let io;

export function initializeSocket(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: env.clientUrl,
      credentials: true
    }
  });

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error("Authentication token is required"));

      const payload = jwt.verify(token, env.jwt.accessSecret);
      socket.user = payload;
      return next();
    } catch (_error) {
      return next(new Error("Invalid socket authentication token"));
    }
  });

  io.on("connection", (socket) => {
    socket.join(`user:${socket.user.sub}`);
    socket.join(`role:${socket.user.role}`);

    socket.on("disconnect", () => {});
  });

  return io;
}

export function getIO() {
  if (!io) {
    throw new Error("Socket.io has not been initialized");
  }
  return io;
}
