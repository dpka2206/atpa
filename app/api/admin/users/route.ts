import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { requireAdminSession } from "@/lib/admin-auth";
import { connectDb } from "@/lib/db";
import { User } from "@/lib/models";
import { ADMIN_ROLES } from "@/lib/constants";

export async function GET() {
  const gate = await requireAdminSession({
    roles: ["super_admin"],
  });
  if (gate.error) return gate.error;

  await connectDb();
  const users = await User.find()
    .select("-passwordHash")
    .sort({ createdAt: -1 })
    .lean();
  return NextResponse.json({ users });
}

const createSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  password: z.string().min(8),
  role: z.enum(ADMIN_ROLES),
});

export async function POST(request: Request) {
  const gate = await requireAdminSession({ roles: ["super_admin"] });
  if (gate.error) return gate.error;

  try {
    const body = createSchema.parse(await request.json());
    await connectDb();
    const email = body.email.toLowerCase().trim();
    const exists = await User.findOne({ email });
    if (exists) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 });
    }
    const passwordHash = await bcrypt.hash(body.password, 12);
    const user = await User.create({
      email,
      name: body.name,
      passwordHash,
      role: body.role,
      active: true,
    });
    return NextResponse.json({
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        active: user.active,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Create failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
