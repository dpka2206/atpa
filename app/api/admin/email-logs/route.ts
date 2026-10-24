import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin-auth";
import { connectDb } from "@/lib/db";
import { EmailLog } from "@/lib/models";
import { resendEmailLog } from "@/lib/email";
import { processEmailQueue } from "@/lib/email-queue";

export async function GET(request: Request) {
  const gate = await requireAdminSession();
  if (gate.error) return gate.error;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  await connectDb();
  const filter: Record<string, unknown> = {};
  if (status) filter.status = status;

  const logs = await EmailLog.find(filter).sort({ createdAt: -1 }).limit(100).lean();
  const queuedCount = await EmailLog.countDocuments({ status: "queued" });
  const failedCount = await EmailLog.countDocuments({ status: "failed" });

  return NextResponse.json({ logs, queuedCount, failedCount });
}

export async function POST(request: Request) {
  const gate = await requireAdminSession({ write: true });
  if (gate.error) return gate.error;

  try {
    const body = await request.json();

    if (body.action === "process_queue") {
      const result = await processEmailQueue({
        limit: Number(body.limit) || 40,
        includeFailed: Boolean(body.includeFailed),
      });
      return NextResponse.json({ ok: true, ...result });
    }

    if (!body.logId) {
      return NextResponse.json({ error: "logId required" }, { status: 400 });
    }
    const result = await resendEmailLog(body.logId);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Email action failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
