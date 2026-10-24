import { NextResponse } from "next/server";
import { Types } from "mongoose";
import { z } from "zod";
import { requireAdminSession } from "@/lib/admin-auth";
import { connectDb } from "@/lib/db";
import { AuditLog, Registration, Tournament } from "@/lib/models";
import {
  PAYMENT_STATUSES,
  REGISTRATION_STATUSES,
} from "@/lib/constants";
import {
  registrationConfirmationHtml,
  sendEmailWithBody,
} from "@/lib/email";
import { format } from "date-fns";

const patchSchema = z.object({
  registrationStatus: z.enum(REGISTRATION_STATUSES).optional(),
  paymentStatus: z.enum(PAYMENT_STATUSES).optional(),
  internalNotes: z.string().optional(),
  rejectionReason: z.string().optional(),
  partnerName: z.string().optional(),
  resendEmail: z.boolean().optional(),
});

type RouteContext = { params: Promise<{ id: string }> };

function registrationQuery(id: string) {
  if (Types.ObjectId.isValid(id) && String(new Types.ObjectId(id)) === id) {
    return { $or: [{ _id: id }, { registrationId: id }] };
  }
  return { registrationId: id };
}

async function sendRegistrationEmail(
  registration: InstanceType<typeof Registration>,
  template: string,
) {
  const tournament = await Tournament.findById(registration.tournamentId);
  if (!tournament) {
    throw new Error("Tournament missing for email");
  }
  const to = registration.playerSnapshot?.email || "";
  if (!to) {
    throw new Error("Player email missing");
  }
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const eventDate = format(tournament.startDate, "d MMM yyyy");
  const feeLabel =
    registration.feeAmount > 0
      ? `${registration.currency} ${registration.feeAmount}`
      : "No fee / TBD";
  const subject = (
    tournament.formConfig?.emailSubjectTemplate ||
    "ATPA Tournament Registration Received — {{tournamentName}}"
  ).replace("{{tournamentName}}", tournament.name);

  await sendEmailWithBody({
    to,
    subject,
    html: registrationConfirmationHtml({
      playerName: registration.playerSnapshot?.fullName || "",
      tournamentName: tournament.name,
      eventDate,
      venue: tournament.venueName,
      category: registration.categoryName,
      partnerName: registration.partnerName || undefined,
      fee: feeLabel,
      paymentStatus: registration.paymentStatus,
      registrationStatus: registration.registrationStatus,
      registrationId: registration.registrationId,
      contact:
        tournament.contactEmail || process.env.ADMIN_NOTIFY_EMAIL || "",
      viewUrl: `${siteUrl}/tournaments/${tournament.slug}`,
    }),
    template,
    registrationId: registration.registrationId,
    tournamentId: String(tournament._id),
  });
}

export async function GET(_request: Request, context: RouteContext) {
  const gate = await requireAdminSession();
  if (gate.error) return gate.error;

  const { id } = await context.params;
  await connectDb();
  const registration = await Registration.findOne(registrationQuery(id)).lean();
  if (!registration) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ registration });
}

export async function PATCH(request: Request, context: RouteContext) {
  const gate = await requireAdminSession({ write: true });
  if (gate.error) return gate.error;

  try {
    const { id } = await context.params;
    const body = patchSchema.parse(await request.json());
    await connectDb();

    const registration = await Registration.findOne(registrationQuery(id));
    if (!registration) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const previousStatus = registration.registrationStatus;

    if (body.registrationStatus) {
      registration.registrationStatus = body.registrationStatus;
    }
    if (body.paymentStatus) {
      registration.paymentStatus = body.paymentStatus;
    }
    if (body.internalNotes !== undefined) {
      registration.internalNotes = body.internalNotes;
    }
    if (body.rejectionReason !== undefined) {
      registration.rejectionReason = body.rejectionReason;
    }
    if (body.partnerName !== undefined) {
      registration.partnerName = body.partnerName;
    }

    await registration.save();

    try {
      const actorId = gate.session!.user.id;
      await AuditLog.create({
        actorUserId:
          Types.ObjectId.isValid(actorId) &&
          String(new Types.ObjectId(actorId)) === actorId
            ? actorId
            : undefined,
        actorEmail: gate.session!.user.email,
        action: body.resendEmail
          ? "registration.resend_email"
          : "registration.update",
        entityType: "registration",
        entityId: registration.registrationId,
        details: body,
      });
    } catch {
      // Audit must not block registration updates
    }

    const becameConfirmed =
      body.registrationStatus === "confirmed" &&
      previousStatus !== "confirmed";

    if (body.resendEmail || becameConfirmed) {
      try {
        await sendRegistrationEmail(
          registration,
          body.resendEmail
            ? "registration_confirmation_resend"
            : "registration_approved",
        );
      } catch (emailErr) {
        const emailMessage =
          emailErr instanceof Error ? emailErr.message : "Email failed";
        return NextResponse.json({
          registration: registration.toObject(),
          warning: `Saved, but email could not be sent: ${emailMessage}`,
        });
      }
    }

    return NextResponse.json({ registration: registration.toObject() });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: err.issues[0]?.message || "Invalid request" },
        { status: 400 },
      );
    }
    const message = err instanceof Error ? err.message : "Update failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
