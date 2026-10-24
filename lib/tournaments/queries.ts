import { connectDb } from "@/lib/db";
import { Tournament } from "@/lib/models";
import {
  ACTIVE_TOURNAMENT_STATUSES,
  PUBLIC_TOURNAMENT_STATUSES,
  type TournamentStatus,
} from "@/lib/constants";

export function isRegistrationOpen(tournament: {
  status: string;
  registrationOpensAt?: Date | null;
  registrationClosesAt?: Date | null;
}) {
  if (tournament.status !== "registration_open") return false;
  const now = Date.now();
  if (
    tournament.registrationOpensAt &&
    tournament.registrationOpensAt.getTime() > now
  ) {
    return false;
  }
  if (
    tournament.registrationClosesAt &&
    tournament.registrationClosesAt.getTime() < now
  ) {
    return false;
  }
  return true;
}

export async function getPublicTournaments() {
  await connectDb();
  return Tournament.find({
    status: { $in: PUBLIC_TOURNAMENT_STATUSES },
  })
    .sort({ startDate: 1 })
    .lean();
}

export async function getUpcomingPublicTournaments(limit = 3) {
  await connectDb();
  const now = new Date();
  return Tournament.find({
    status: {
      $in: PUBLIC_TOURNAMENT_STATUSES.filter((s) => s !== "completed"),
    },
    endDate: { $gte: now },
  })
    .sort({ startDate: 1 })
    .limit(limit)
    .lean();
}

export async function getPastPublicTournaments() {
  await connectDb();
  const now = new Date();
  return Tournament.find({
    $or: [
      { status: "completed" },
      {
        status: { $in: PUBLIC_TOURNAMENT_STATUSES },
        endDate: { $lt: now },
      },
    ],
  })
    .sort({ startDate: -1 })
    .lean();
}

export async function getPublicTournamentBySlug(slug: string) {
  await connectDb();
  return Tournament.findOne({
    slug,
    status: { $in: PUBLIC_TOURNAMENT_STATUSES },
  }).lean();
}

export async function getOpenRegistrationTournaments() {
  await connectDb();
  const tournaments = await Tournament.find({
    status: "registration_open",
  })
    .sort({ startDate: 1 })
    .lean();
  return tournaments.filter((t) => isRegistrationOpen(t));
}

export function assertStatusTransition(
  from: TournamentStatus,
  to: TournamentStatus,
) {
  if (from === to) return;
  // Practical admin jumps for Phase 1 (draft can go straight to registration_open for demos)
  const allowed: Record<TournamentStatus, TournamentStatus[]> = {
    draft: ["published", "registration_open", "registration_closed", "archived"],
    published: [
      "draft",
      "registration_open",
      "registration_closed",
      "archived",
    ],
    registration_open: [
      "draft",
      "published",
      "registration_closed",
      "in_progress",
      "archived",
    ],
    registration_closed: [
      "registration_open",
      "draws_published",
      "in_progress",
      "published",
      "archived",
    ],
    draws_published: [
      "registration_closed",
      "in_progress",
      "archived",
    ],
    in_progress: ["completed", "registration_closed", "archived"],
    completed: ["archived", "in_progress"],
    archived: ["draft", "published"],
  };
  if (!allowed[from]?.includes(to)) {
    throw new Error(
      `Cannot change status from "${from.replaceAll("_", " ")}" to "${to.replaceAll("_", " ")}". Pick a nearby status and try again.`,
    );
  }
}

export async function countActiveTournaments() {
  await connectDb();
  return Tournament.countDocuments({
    status: { $in: ACTIVE_TOURNAMENT_STATUSES },
  });
}
