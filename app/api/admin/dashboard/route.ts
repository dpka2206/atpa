import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin-auth";
import { connectDb } from "@/lib/db";
import { Player, Registration, Tournament } from "@/lib/models";
import {
  ACTIVE_TOURNAMENT_STATUSES,
  PUBLIC_TOURNAMENT_STATUSES,
} from "@/lib/constants";

export async function GET() {
  const gate = await requireAdminSession();
  if (gate.error) return gate.error;

  await connectDb();

  const [
    totalPlayers,
    activeTournaments,
    totalRegistrations,
    paymentPending,
    paymentNa,
    awaitingReview,
    upcoming,
    recentRegistrations,
  ] = await Promise.all([
    Player.countDocuments(),
    Tournament.countDocuments({
      status: { $in: ACTIVE_TOURNAMENT_STATUSES },
    }),
    Registration.countDocuments(),
    Registration.countDocuments({ paymentStatus: "pending" }),
    Registration.countDocuments({ paymentStatus: "not_applicable" }),
    Registration.countDocuments({ registrationStatus: "awaiting_review" }),
    Tournament.find({
      status: { $in: PUBLIC_TOURNAMENT_STATUSES.filter((s) => s !== "completed") },
      endDate: { $gte: new Date() },
    })
      .sort({ startDate: 1 })
      .limit(5)
      .select("name slug startDate venueName status registrationClosesAt")
      .lean(),
    Registration.find()
      .sort({ createdAt: -1 })
      .limit(8)
      .select(
        "registrationId tournamentId categoryName registrationStatus paymentStatus playerSnapshot createdAt",
      )
      .lean(),
  ]);

  return NextResponse.json({
    counts: {
      totalPlayers,
      activeTournaments,
      totalRegistrations,
      paymentPending,
      paymentNa,
      awaitingReview,
    },
    upcoming,
    recentRegistrations,
  });
}
