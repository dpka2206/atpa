import { auth } from "@/lib/auth";
import type { AdminRole } from "@/lib/constants";
import { NextResponse } from "next/server";

const WRITE_ROLES: AdminRole[] = [
  "super_admin",
  "association_admin",
  "tournament_manager",
];

export async function requireAdminSession(
  options: { write?: boolean; roles?: AdminRole[] } = {},
) {
  const session = await auth();
  if (!session?.user?.email) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  const role = session.user.role;
  if (options.roles && !options.roles.includes(role)) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  if (options.write && !WRITE_ROLES.includes(role) && role !== "super_admin") {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }

  return { session };
}

export function canManageTournaments(role: AdminRole) {
  return (
    role === "super_admin" ||
    role === "association_admin" ||
    role === "tournament_manager"
  );
}
