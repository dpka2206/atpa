/**
 * Seed Super Admin user. Run: npm run seed:admin
 */
import bcrypt from "bcryptjs";
import { connectDb } from "../lib/db";
import { User } from "../lib/models";

async function main() {
  const email = (process.env.AUTH_ADMIN_EMAIL || "").toLowerCase().trim();
  const password = process.env.AUTH_ADMIN_PASSWORD || "";
  const name = process.env.AUTH_ADMIN_NAME || "ATPA Super Admin";

  if (!email || !password) {
    throw new Error("AUTH_ADMIN_EMAIL and AUTH_ADMIN_PASSWORD are required");
  }
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is required");
  }

  await connectDb();

  const passwordHash = await bcrypt.hash(password, 12);
  const existing = await User.findOne({ email });

  if (existing) {
    existing.passwordHash = passwordHash;
    existing.role = "super_admin";
    existing.name = name;
    existing.active = true;
    await existing.save();
    console.log(`Updated super admin: ${email}`);
  } else {
    await User.create({
      email,
      name,
      passwordHash,
      role: "super_admin",
      active: true,
    });
    console.log(`Created super admin: ${email}`);
  }

  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
