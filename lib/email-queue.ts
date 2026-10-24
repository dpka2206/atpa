import nodemailer from "nodemailer";
import { connectDb } from "@/lib/db";
import { EmailLog } from "@/lib/models";
import type { SendEmailInput } from "@/lib/email";

function getTransport() {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT || 465);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!user || !pass) {
    throw new Error("SMTP_USER and SMTP_PASS must be set");
  }
  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
    pool: true,
    maxConnections: 2,
    maxMessages: 50,
    rateDelta: 1000,
    rateLimit: 3,
  });
}

let sharedTransport: ReturnType<typeof getTransport> | null = null;

function transport() {
  if (!sharedTransport) sharedTransport = getTransport();
  return sharedTransport;
}

/** Persist email as queued — does not send yet. */
export async function enqueueEmail(input: SendEmailInput) {
  await connectDb();
  const log = await EmailLog.create({
    to: input.to,
    subject: input.subject,
    template: input.template,
    status: "queued",
    registrationId: input.registrationId,
    tournamentId: input.tournamentId,
    attempts: 0,
    meta: { html: input.html, text: input.text },
  });
  return { logId: String(log._id) };
}

export async function deliverEmailById(logId: string) {
  await connectDb();
  const log = await EmailLog.findById(logId);
  if (!log) return { ok: false as const, error: "Email log not found" };
  if (log.status === "sent") return { ok: true as const, skipped: true as const };

  const html = String((log.meta as { html?: string } | undefined)?.html || "");
  const text = String((log.meta as { text?: string } | undefined)?.text || "");
  if (!html) {
    log.status = "failed";
    log.error = "Missing email body in queue meta";
    log.attempts = (log.attempts || 0) + 1;
    await log.save();
    return { ok: false as const, error: log.error };
  }

  try {
    const from = process.env.EMAIL_FROM || process.env.SMTP_USER!;
    await transport().sendMail({
      from,
      to: log.to,
      subject: log.subject,
      html,
      text: text || undefined,
    });
    log.status = "sent";
    log.error = "";
    log.attempts = (log.attempts || 0) + 1;
    await log.save();
    return { ok: true as const };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Email send failed";
    log.status = "failed";
    log.error = message;
    log.attempts = (log.attempts || 0) + 1;
    await log.save();
    return { ok: false as const, error: message };
  }
}

/** Deliver specific queued jobs (used after registration response). */
export async function deliverEmailJobs(logIds: string[]) {
  const results = [];
  for (const id of logIds) {
    results.push(await deliverEmailById(id));
    // Soft pacing for Gmail SMTP under bursts
    await sleep(150);
  }
  return results;
}

/**
 * Drain pending/failed emails from the DB queue.
 * Safe to call from after() hooks, admin UI, or a cron.
 */
export async function processEmailQueue(options: {
  limit?: number;
  includeFailed?: boolean;
} = {}) {
  await connectDb();
  const limit = options.limit ?? 25;
  const statuses = options.includeFailed ? ["queued", "failed"] : ["queued"];

  const logs = await EmailLog.find({
    status: { $in: statuses },
    "meta.html": { $exists: true },
  })
    .sort({ createdAt: 1 })
    .limit(limit)
    .select("_id");

  let sent = 0;
  let failed = 0;
  for (const row of logs) {
    // Re-queue failed items so deliverEmailById will try again
    if (options.includeFailed) {
      await EmailLog.updateOne(
        { _id: row._id, status: "failed" },
        { $set: { status: "queued" } },
      );
    }
    const result = await deliverEmailById(String(row._id));
    if (result.ok) sent += 1;
    else failed += 1;
    await sleep(200);
  }

  return { processed: logs.length, sent, failed };
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
