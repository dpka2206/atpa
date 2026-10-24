import nodemailer from "nodemailer";
import { connectDb } from "@/lib/db";
import { EmailLog } from "@/lib/models";

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
  });
}

export type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
  text?: string;
  template: string;
  registrationId?: string;
  tournamentId?: string;
};

export async function sendEmail(input: SendEmailInput) {
  await connectDb();

  const log = await EmailLog.create({
    to: input.to,
    subject: input.subject,
    template: input.template,
    status: "queued",
    registrationId: input.registrationId,
    tournamentId: input.tournamentId,
    attempts: 0,
  });

  try {
    const transport = getTransport();
    const from = process.env.EMAIL_FROM || process.env.SMTP_USER!;
    await transport.sendMail({
      from,
      to: input.to,
      subject: input.subject,
      html: input.html,
      text: input.text,
    });
    log.status = "sent";
    log.attempts = 1;
    await log.save();
    return { ok: true as const, logId: String(log._id) };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Email send failed";
    log.status = "failed";
    log.error = message;
    log.attempts = 1;
    await log.save();
    return { ok: false as const, error: message, logId: String(log._id) };
  }
}

export async function resendEmailLog(logId: string) {
  const { deliverEmailById } = await import("@/lib/email-queue");
  await connectDb();
  const log = await EmailLog.findById(logId);
  if (!log) throw new Error("Email log not found");
  if (!log.meta || typeof log.meta !== "object" || !("html" in log.meta)) {
    throw new Error("Cannot resend: original email body was not stored");
  }
  // Allow another attempt even if previously sent/failed
  log.status = "queued";
  log.error = "";
  await log.save();
  return deliverEmailById(logId);
}

export function registrationConfirmationHtml(params: {
  playerName: string;
  tournamentName: string;
  eventDate: string;
  venue: string;
  category: string;
  partnerName?: string;
  fee: string;
  paymentStatus: string;
  registrationStatus: string;
  registrationId: string;
  contact: string;
  viewUrl?: string;
}) {
  const partnerRow = params.partnerName
    ? `<li><strong>Doubles partner:</strong> ${escapeHtml(params.partnerName)}</li>`
    : "";
  const link = params.viewUrl
    ? `<p><a href="${escapeHtml(params.viewUrl)}">View tournament details</a></p>`
    : "";

  return `
  <div style="font-family: Manrope, Arial, sans-serif; color: #0f1a2c; line-height: 1.5; max-width: 560px;">
    <p>Dear ${escapeHtml(params.playerName)},</p>
    <p>Thank you for registering with the Amateur Telangana Pickleball Association.</p>
    <p>We have received your registration for <strong>${escapeHtml(params.tournamentName)}</strong>. Please review your submitted details below.</p>
    <p><strong>Registration details</strong></p>
    <ul>
      <li><strong>Registration ID:</strong> ${escapeHtml(params.registrationId)}</li>
      <li><strong>Tournament:</strong> ${escapeHtml(params.tournamentName)}</li>
      <li><strong>Event date:</strong> ${escapeHtml(params.eventDate)}</li>
      <li><strong>Venue:</strong> ${escapeHtml(params.venue)}</li>
      <li><strong>Category:</strong> ${escapeHtml(params.category)}</li>
      ${partnerRow}
      <li><strong>Registration fee:</strong> ${escapeHtml(params.fee)}</li>
      <li><strong>Payment status:</strong> ${escapeHtml(params.paymentStatus)}</li>
      <li><strong>Registration status:</strong> ${escapeHtml(params.registrationStatus)}</li>
    </ul>
    ${link}
    <p>You can contact the tournament organizers at ${escapeHtml(params.contact)} if you need to make a correction.</p>
    <p>Thank you,<br/>ATPA — Amateur Telangana Pickleball Association</p>
  </div>`;
}

export function adminRegistrationAlertHtml(params: {
  playerName: string;
  email: string;
  phone: string;
  tournamentName: string;
  category: string;
  registrationId: string;
  adminUrl?: string;
}) {
  const link = params.adminUrl
    ? `<p><a href="${escapeHtml(params.adminUrl)}">Open in admin</a></p>`
    : "";
  return `
  <div style="font-family: Arial, sans-serif; color: #0f1a2c;">
    <p>New registration received.</p>
    <ul>
      <li><strong>ID:</strong> ${escapeHtml(params.registrationId)}</li>
      <li><strong>Player:</strong> ${escapeHtml(params.playerName)}</li>
      <li><strong>Email:</strong> ${escapeHtml(params.email)}</li>
      <li><strong>Phone:</strong> ${escapeHtml(params.phone)}</li>
      <li><strong>Tournament:</strong> ${escapeHtml(params.tournamentName)}</li>
      <li><strong>Category:</strong> ${escapeHtml(params.category)}</li>
    </ul>
    ${link}
  </div>`;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Enqueue then deliver immediately (admin resend / sync paths). */
export async function sendEmailWithBody(input: SendEmailInput) {
  const { enqueueEmail, deliverEmailById } = await import("@/lib/email-queue");
  const { logId } = await enqueueEmail(input);
  const result = await deliverEmailById(logId);
  return { ...result, logId };
}
