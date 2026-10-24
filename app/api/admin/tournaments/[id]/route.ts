import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminSession } from "@/lib/admin-auth";
import { connectDb } from "@/lib/db";
import { AuditLog, Tournament } from "@/lib/models";
import { CATEGORY_TYPES, DEFAULT_FORM_FIELDS, TOURNAMENT_STATUSES } from "@/lib/constants";
import { assertStatusTransition } from "@/lib/tournaments/queries";
import type { TournamentStatus } from "@/lib/constants";
import { slugify } from "@/lib/slug";
import { validateTournamentDates } from "@/lib/tournaments/validation";

const categorySchema = z.object({
  _id: z.string().optional(),
  key: z.string().min(1),
  name: z.string().min(1),
  type: z.enum(CATEGORY_TYPES),
  ageGroup: z.string().optional(),
  skillLevel: z.string().optional(),
  fee: z.number().min(0).optional(),
  currency: z.string().optional(),
  maxEntries: z.number().positive().optional().nullable(),
  eligibilityNotes: z.string().optional(),
});

const updateSchema = z.object({
  name: z.string().min(2).optional(),
  slug: z.string().optional(),
  description: z.string().optional(),
  bannerUrl: z.string().optional(),
  posterUrl: z.string().optional(),
  galleryUrls: z.array(z.string()).optional(),
  organizerName: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  reportingTime: z.string().optional(),
  venueName: z.string().optional(),
  venueAddress: z.string().optional(),
  mapLink: z.string().optional(),
  registrationOpensAt: z.string().nullable().optional(),
  registrationClosesAt: z.string().nullable().optional(),
  categories: z.array(categorySchema).optional(),
  prizeDetails: z.string().optional(),
  formatNotes: z.string().optional(),
  scoringRules: z.string().optional(),
  cancellationPolicy: z.string().optional(),
  refundPolicy: z.string().optional(),
  contactEmail: z.string().optional(),
  contactPhone: z.string().optional(),
  status: z.enum(TOURNAMENT_STATUSES).optional(),
  formConfig: z
    .object({
      fields: z.record(
        z.string(),
        z.object({
          enabled: z.boolean(),
          required: z.boolean(),
        }),
      ).optional(),
      successMessage: z.string().optional(),
      emailSubjectTemplate: z.string().optional(),
    })
    .optional(),
});

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const gate = await requireAdminSession();
  if (gate.error) return gate.error;

  const { id } = await context.params;
  await connectDb();
  const tournament = await Tournament.findById(id).lean();
  if (!tournament) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ tournament });
}

export async function PATCH(request: Request, context: RouteContext) {
  const gate = await requireAdminSession({ write: true });
  if (gate.error) return gate.error;

  try {
    const { id } = await context.params;
    const body = updateSchema.parse(await request.json());
    await connectDb();

    const tournament = await Tournament.findById(id);
    if (!tournament) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const nextStart = body.startDate || tournament.startDate.toISOString();
    const nextEnd = body.endDate || tournament.endDate.toISOString();
    const nextOpens =
      body.registrationOpensAt !== undefined
        ? body.registrationOpensAt
        : tournament.registrationOpensAt
          ? tournament.registrationOpensAt.toISOString()
          : null;
    const nextCloses =
      body.registrationClosesAt !== undefined
        ? body.registrationClosesAt
        : tournament.registrationClosesAt
          ? tournament.registrationClosesAt.toISOString()
          : null;
    const allowPastStart = tournament.startDate < new Date();
    const dateCheck = validateTournamentDates({
      startDate: nextStart,
      endDate: nextEnd,
      registrationOpensAt: nextOpens,
      registrationClosesAt: nextCloses,
      allowPastStart,
    });
    if (!dateCheck.ok) {
      return NextResponse.json(
        { error: dateCheck.message, fieldErrors: dateCheck.errors },
        { status: 400 },
      );
    }

    if (body.status && body.status !== tournament.status) {
      assertStatusTransition(
        tournament.status as TournamentStatus,
        body.status as TournamentStatus,
      );
      tournament.status = body.status;
    }

    if (body.name) tournament.name = body.name;
    if (body.slug) {
      const nextSlug = slugify(body.slug);
      const clash = await Tournament.findOne({
        slug: nextSlug,
        _id: { $ne: tournament._id },
      });
      if (clash) {
        return NextResponse.json({ error: "Slug already in use" }, { status: 409 });
      }
      tournament.slug = nextSlug;
    }
    if (body.description !== undefined) tournament.description = body.description;
    if (body.bannerUrl !== undefined) tournament.bannerUrl = body.bannerUrl;
    if (body.posterUrl !== undefined) tournament.posterUrl = body.posterUrl;
    if (body.galleryUrls) tournament.galleryUrls = body.galleryUrls;
    if (body.organizerName !== undefined) tournament.organizerName = body.organizerName;
    if (body.startDate) tournament.startDate = new Date(body.startDate);
    if (body.endDate) tournament.endDate = new Date(body.endDate);
    if (body.reportingTime !== undefined) tournament.reportingTime = body.reportingTime;
    if (body.venueName) tournament.venueName = body.venueName;
    if (body.venueAddress !== undefined) tournament.venueAddress = body.venueAddress;
    if (body.mapLink !== undefined) tournament.mapLink = body.mapLink;
    if (body.registrationOpensAt !== undefined) {
      tournament.registrationOpensAt = body.registrationOpensAt
        ? new Date(body.registrationOpensAt)
        : undefined;
    }
    if (body.registrationClosesAt !== undefined) {
      tournament.registrationClosesAt = body.registrationClosesAt
        ? new Date(body.registrationClosesAt)
        : undefined;
    }
    if (body.categories) {
      tournament.categories = body.categories.map((c) => ({
        ...c,
        fee: c.fee ?? 0,
        currency: c.currency || "INR",
      })) as typeof tournament.categories;
    }
    if (body.prizeDetails !== undefined) tournament.prizeDetails = body.prizeDetails;
    if (body.formatNotes !== undefined) tournament.formatNotes = body.formatNotes;
    if (body.scoringRules !== undefined) tournament.scoringRules = body.scoringRules;
    if (body.cancellationPolicy !== undefined) {
      tournament.cancellationPolicy = body.cancellationPolicy;
    }
    if (body.refundPolicy !== undefined) tournament.refundPolicy = body.refundPolicy;
    if (body.contactEmail !== undefined) tournament.contactEmail = body.contactEmail;
    if (body.contactPhone !== undefined) tournament.contactPhone = body.contactPhone;

    if (body.formConfig) {
      const currentFields =
        (tournament.formConfig?.fields as Record<
          string,
          { enabled: boolean; required: boolean }
        >) || structuredClone(DEFAULT_FORM_FIELDS);
      tournament.formConfig = {
        fields: body.formConfig.fields
          ? { ...currentFields, ...body.formConfig.fields }
          : currentFields,
        successMessage:
          body.formConfig.successMessage ??
          tournament.formConfig?.successMessage ??
          "",
        emailSubjectTemplate:
          body.formConfig.emailSubjectTemplate ??
          tournament.formConfig?.emailSubjectTemplate ??
          "",
      };
    }

    await tournament.save();

    await AuditLog.create({
      actorUserId: gate.session!.user.id,
      actorEmail: gate.session!.user.email,
      action: "tournament.update",
      entityType: "tournament",
      entityId: String(tournament._id),
      details: { fields: Object.keys(body) },
    });

    return NextResponse.json({ tournament });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Update failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
