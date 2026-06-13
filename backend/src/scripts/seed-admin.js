import { connectDatabase, disconnectDatabase } from "../config/database.js";
import { User } from "../models/user.model.js";
import { hashPassword } from "../utils/password.js";
import { roles } from "../utils/rbac.js";

const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;
const adminName = process.env.ADMIN_NAME || "Platform Admin";

if (!adminEmail || !adminPassword) {
  throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD are required to seed an admin user");
}

await connectDatabase();

const existingAdmin = await User.findOne({ email: adminEmail });

if (existingAdmin) {
  console.log(`Admin already exists: ${adminEmail}`);
} else {
  await User.create({
    name: adminName,
    email: adminEmail,
    passwordHash: await hashPassword(adminPassword),
    role: roles.ADMIN,
    status: "active",
    emailVerified: true
  });

  console.log(`Admin created: ${adminEmail}`);
}

await disconnectDatabase();
