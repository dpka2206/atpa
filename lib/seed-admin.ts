import bcrypt from "bcryptjs";
import { User } from "@/lib/models";

let seeded = false;

/** Idempotent seed of the Super Admin from env (runs once per process). */
export async function ensureSeedAdmin() {
  if (seeded) return;
  const email = (process.env.AUTH_ADMIN_EMAIL || "").toLowerCase().trim();
  const password = process.env.AUTH_ADMIN_PASSWORD || "";
  if (!email || !password) {
    seeded = true;
    return;
  }

  const existing = await User.findOne({ email });
  if (!existing) {
    const passwordHash = await bcrypt.hash(password, 12);
    await User.create({
      email,
      name: "ATPA Super Admin",
      passwordHash,
      role: "super_admin",
      active: true,
    });
  }
  seeded = true;
}
