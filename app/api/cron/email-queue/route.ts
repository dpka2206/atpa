import { NextResponse } from "next/server";
import { processEmailQueue } from "@/lib/email-queue";

/**
 * Optional cron/drain endpoint for stuck queued emails.
 * Protect with CRON_SECRET header: Authorization: Bearer <CRON_SECRET>
 * If CRON_SECRET is unset, only localhost-style use is intended in admin UI.
 */
export async function POST(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = request.headers.get("authorization") || "";
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    const result = await processEmailQueue({
      limit: 50,
      includeFailed: false,
    });
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Queue process failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  return POST(request);
}
