import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminSession } from "@/lib/admin-auth";
import { connectDb } from "@/lib/db";
import { Tournament, AuditLog } from "@/lib/models";
import { CATEGORY_TYPES, TOURNAMENT_STATUSES } from "@/lib/constants";
import { makeTournamentCode, slugify } from "@/lib/slug";
import { validateTournamentDates } from "@/lib/tournaments/validation";

const categorySchema = z.object({
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

const createSchema = z.object({
  name: z.string().min(2),
  slug: z.string().optional(),
  description: z.string().optional(),
  bannerUrl: z.string().optional(),
  posterUrl: z.string().optional(),
  organizerName: z.string().optional(),
  startDate: z.string(),
  endDate: z.string(),
  reportingTime: z.string().optional(),
  venueName: z.string().min(1),
  venueAddress: z.string().optional(),
  mapLink: z.string().optional(),
  registrationOpensAt: z.string().optional().nullable(),
  registrationClosesAt: z.string().optional().nullable(),
  categories: z.array(categorySchema).default([]),
  prizeDetails: z.string().optional(),
  formatNotes: z.string().optional(),
  scoringRules: z.string().optional(),
  cancellationPolicy: z.string().optional(),
  refundPolicy: z.string().optional(),
  contactEmail: z.string().optional(),
  contactPhone: z.string().optional(),
  status: z.enum(TOURNAMENT_STATUSES).optional(),
});

export async function GET() {
  const gate = await requireAdminSession();
  if (gate.error) return gate.error;

  await connectDb();
  const tournaments = await Tournament.find()
    .sort({ startDate: -1 })
    .lean();
  return NextResponse.json({ tournaments });
}

export async function POST(request: Request) {
  const gate = await requireAdminSession({ write: true });
  if (gate.error) return gate.error;

  try {
    const body = createSchema.parse(await request.json());
    const dateCheck = validateTournamentDates({
      startDate: body.startDate,
      endDate: body.endDate,
      registrationOpensAt: body.registrationOpensAt,
      registrationClosesAt: body.registrationClosesAt,
      allowPastStart: false,
    });
    if (!dateCheck.ok) {
      return NextResponse.json(
        { error: dateCheck.message, fieldErrors: dateCheck.errors },
        { status: 400 },
      );
    }
    if (!body.categories.length) {
      return NextResponse.json(
        {
          error: "Add at least one category.",
          fieldErrors: { categories: "Add at least one category." },
        },
        { status: 400 },
      );
    }

    await connectDb();

    let slug = slugify(body.slug || body.name);
    const existingSlug = await Tournament.findOne({ slug });
    if (existingSlug) {
      slug = `${slug}-${Math.random().toString(36).slice(2, 5)}`;
    }

    const tournament = await Tournament.create({
      ...body,
      slug,
      tournamentCode: makeTournamentCode(body.name),
      startDate: new Date(body.startDate),
      endDate: new Date(body.endDate),
      registrationOpensAt: body.registrationOpensAt
        ? new Date(body.registrationOpensAt)
        : undefined,
      registrationClosesAt: body.registrationClosesAt
        ? new Date(body.registrationClosesAt)
        : undefined,
      status: body.status || "draft",
      categories: body.categories.map((c) => ({
        ...c,
        fee: c.fee ?? 0,
        currency: c.currency || "INR",
      })),
    });

    await AuditLog.create({
      actorUserId: gate.session!.user.id,
      actorEmail: gate.session!.user.email,
      action: "tournament.create",
      entityType: "tournament",
      entityId: String(tournament._id),
      details: { name: tournament.name, slug: tournament.slug },
    });

    return NextResponse.json({ tournament }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Create failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
