import { z } from "zod";
import { connectDb } from "@/lib/db";
import { Player, Registration, Tournament } from "@/lib/models";
import { makeRegistrationId } from "@/lib/slug";
import { isRegistrationOpen } from "@/lib/tournaments/queries";
import {
  adminRegistrationAlertHtml,
  registrationConfirmationHtml,
} from "@/lib/email";
import { enqueueEmail } from "@/lib/email-queue";
import { format } from "date-fns";

const submitSchema = z.object({
  tournamentSlug: z.string().min(1),
  categoryId: z.string().min(1),
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
  city: z.string().optional(),
  district: z.string().optional(),
  emergencyContact: z.string().optional(),
  skillLevel: z.string().optional(),
  partnerName: z.string().optional(),
  membershipId: z.string().optional(),
  rulesConsent: z.boolean().optional(),
  privacyConsent: z.boolean().optional(),
  photoConsent: z.boolean().optional(),
  idempotencyKey: z.string().optional(),
});

export type RegistrationSubmitInput = z.infer<typeof submitSchema>;

type FormFieldConfig = { enabled?: boolean; required?: boolean };

function fieldRequired(
  fields: Record<string, FormFieldConfig> | undefined,
  key: string,
) {
  const f = fields?.[key];
  if (!f || f.enabled === false) return false;
  return Boolean(f.required);
}

function fieldEnabled(
  fields: Record<string, FormFieldConfig> | undefined,
  key: string,
) {
  const f = fields?.[key];
  if (!f) return true;
  return f.enabled !== false;
}

export async function createRegistration(raw: unknown) {
  const data = submitSchema.parse(raw);
  await connectDb();

  if (data.idempotencyKey) {
    const existing = await Registration.findOne({
      idempotencyKey: data.idempotencyKey,
    }).lean();
    if (existing) {
      return {
        registrationId: existing.registrationId,
        duplicate: true as const,
      };
    }
  }

  const tournament = await Tournament.findOne({ slug: data.tournamentSlug });
  if (!tournament) {
    throw Object.assign(new Error("Tournament not found"), { status: 404 });
  }
  if (!isRegistrationOpen(tournament)) {
    throw Object.assign(new Error("Registration is closed for this tournament"), {
      status: 403,
    });
  }

  const category = tournament.categories.id(data.categoryId);
  if (!category) {
    throw Object.assign(new Error("Invalid category"), { status: 400 });
  }

  const fields = (tournament.formConfig?.fields || {}) as Record<
    string,
    FormFieldConfig
  >;

  const requiredChecks: [string, unknown][] = [
    ["fullName", data.fullName],
    ["email", data.email],
    ["phone", data.phone],
  ];
  for (const [key, value] of [
    ["dateOfBirth", data.dateOfBirth],
    ["gender", data.gender],
    ["city", data.city],
    ["district", data.district],
    ["emergencyContact", data.emergencyContact],
    ["skillLevel", data.skillLevel],
    ["partnerName", data.partnerName],
    ["membershipId", data.membershipId],
  ] as const) {
    if (fieldRequired(fields, key) && fieldEnabled(fields, key) && !value) {
      throw Object.assign(new Error(`${key} is required`), { status: 400 });
    }
  }
  for (const [key, value] of requiredChecks) {
    if (!value) {
      throw Object.assign(new Error(`${key} is required`), { status: 400 });
    }
  }
  if (fieldRequired(fields, "rulesConsent") && !data.rulesConsent) {
    throw Object.assign(new Error("You must agree to the tournament rules"), {
      status: 400,
    });
  }
  if (fieldRequired(fields, "privacyConsent") && !data.privacyConsent) {
    throw Object.assign(new Error("Privacy consent is required"), {
      status: 400,
    });
  }
  if (
    (category.type === "doubles" || category.type === "mixed_doubles") &&
    fieldEnabled(fields, "partnerName") &&
    fieldRequired(fields, "partnerName") &&
    !data.partnerName
  ) {
    throw Object.assign(new Error("Partner name is required for this category"), {
      status: 400,
    });
  }

  if (category.maxEntries) {
    const count = await Registration.countDocuments({
      tournamentId: tournament._id,
      categoryId: category._id,
      registrationStatus: { $nin: ["rejected", "cancelled"] },
    });
    if (count >= category.maxEntries) {
      throw Object.assign(new Error("This category is full"), { status: 409 });
    }
  }

  const email = data.email.toLowerCase().trim();
  const duplicate = await Registration.findOne({
    tournamentId: tournament._id,
    categoryId: category._id,
    "playerSnapshot.email": email,
  });
  if (duplicate) {
    throw Object.assign(
      new Error("You are already registered in this category for this tournament"),
      { status: 409 },
    );
  }

  let player = await Player.findOne({ email });
  const dob = data.dateOfBirth ? new Date(data.dateOfBirth) : undefined;
  if (player) {
    player.fullName = data.fullName.trim();
    player.phone = data.phone.trim();
    if (dob) player.dateOfBirth = dob;
    if (data.gender) player.gender = data.gender;
    if (data.city) player.city = data.city;
    if (data.district) player.district = data.district;
    if (data.emergencyContact) player.emergencyContact = data.emergencyContact;
    if (data.membershipId) player.membershipId = data.membershipId;
    if (data.skillLevel) player.skillLevel = data.skillLevel;
    await player.save();
  } else {
    player = await Player.create({
      fullName: data.fullName.trim(),
      email,
      phone: data.phone.trim(),
      dateOfBirth: dob,
      gender: data.gender,
      city: data.city,
      district: data.district,
      emergencyContact: data.emergencyContact,
      membershipId: data.membershipId,
      skillLevel: data.skillLevel,
    });
  }

  const registrationId = makeRegistrationId();
  const feeAmount = category.fee || 0;
  const paymentStatus = feeAmount > 0 ? "pending" : "not_applicable";

  const registration = await Registration.create({
    registrationId,
    tournamentId: tournament._id,
    playerId: player._id,
    categoryId: category._id,
    categoryKey: category.key,
    categoryName: category.name,
    partnerName: data.partnerName || "",
    registrationStatus: "awaiting_review",
    paymentStatus,
    feeAmount,
    currency: category.currency || "INR",
    idempotencyKey: data.idempotencyKey,
    answers: {
      rulesConsent: data.rulesConsent,
      privacyConsent: data.privacyConsent,
      photoConsent: data.photoConsent,
    },
    playerSnapshot: {
      fullName: player.fullName,
      email: player.email,
      phone: player.phone,
      city: player.city,
      district: player.district,
      dateOfBirth: player.dateOfBirth,
      gender: player.gender,
      skillLevel: player.skillLevel,
      membershipId: player.membershipId,
      emergencyContact: player.emergencyContact,
    },
  });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const eventDate = `${format(tournament.startDate, "d MMM yyyy")}${
    tournament.endDate &&
    tournament.endDate.toDateString() !== tournament.startDate.toDateString()
      ? ` – ${format(tournament.endDate, "d MMM yyyy")}`
      : ""
  }`;
  const feeLabel =
    feeAmount > 0
      ? `${category.currency || "INR"} ${feeAmount}`
      : "No fee / TBD";
  const contact =
    tournament.contactEmail ||
    process.env.ADMIN_NOTIFY_EMAIL ||
    "amateurtelanganapickleball@gmail.com";

  const subjectTemplate =
    tournament.formConfig?.emailSubjectTemplate ||
    "ATPA Tournament Registration Received — {{tournamentName}}";
  const subject = subjectTemplate.replace(
    "{{tournamentName}}",
    tournament.name,
  );

  const playerHtml = registrationConfirmationHtml({
    playerName: player.fullName,
    tournamentName: tournament.name,
    eventDate,
    venue: tournament.venueName,
    category: category.name,
    partnerName: data.partnerName,
    fee: feeLabel,
    paymentStatus,
    registrationStatus: registration.registrationStatus,
    registrationId,
    contact,
    viewUrl: `${siteUrl}/tournaments/${tournament.slug}`,
  });

  // Queue emails only — delivery runs after the HTTP response (see route after()).
  const emailJobIds: string[] = [];

  const playerJob = await enqueueEmail({
    to: player.email,
    subject,
    html: playerHtml,
    template: "registration_confirmation",
    registrationId,
    tournamentId: String(tournament._id),
  });
  emailJobIds.push(playerJob.logId);

  const adminTo =
    tournament.contactEmail ||
    process.env.ADMIN_NOTIFY_EMAIL ||
    process.env.SMTP_USER;
  if (adminTo) {
    const adminJob = await enqueueEmail({
      to: adminTo,
      subject: `New registration — ${tournament.name} (${registrationId})`,
      html: adminRegistrationAlertHtml({
        playerName: player.fullName,
        email: player.email,
        phone: player.phone,
        tournamentName: tournament.name,
        category: category.name,
        registrationId,
        adminUrl: `${siteUrl}/admin/tournaments/${tournament._id}?tab=registrations`,
      }),
      template: "admin_registration_alert",
      registrationId,
      tournamentId: String(tournament._id),
    });
    emailJobIds.push(adminJob.logId);
  }

  return {
    registrationId: registration.registrationId,
    successMessage:
      tournament.formConfig?.successMessage ||
      "Thank you for registering with ATPA.",
    duplicate: false as const,
    emailJobIds,
  };
}
