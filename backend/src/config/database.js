import mongoose from "mongoose";
import { env } from "./env.js";

export async function connectDatabase() {
  mongoose.set("strictQuery", true);

  const connection = await mongoose.connect(env.mongoUri, {
    autoIndex: !env.isProduction
  });

  console.log(`MongoDB connected: ${connection.connection.host}`);
}

export async function disconnectDatabase() {
  await mongoose.disconnect();
}
