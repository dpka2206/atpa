import { format } from "date-fns";
import type { Tournament as CardTournament } from "@/lib/types";
import { isRegistrationOpen } from "@/lib/tournaments/queries";

type DbTournament = {
  _id: unknown;
  slug: string;
  name: string;
  startDate: Date | string;
  endDate: Date | string;
  venueName: string;
  bannerUrl?: string;
  posterUrl?: string;
  description?: string;
  status: string;
  registrationOpensAt?: Date | string | null;
  registrationClosesAt?: Date | string | null;
  categories?: Array<{ name: string }>;
};

export function mapTournamentToCard(t: DbTournament): CardTournament {
  const start = new Date(t.startDate);
  const end = new Date(t.endDate);
  const sameDay = start.toDateString() === end.toDateString();
  const date = sameDay
    ? format(start, "d MMMM yyyy")
    : `${format(start, "d MMM")} – ${format(end, "d MMM yyyy")}`;

  const closes = t.registrationClosesAt
    ? format(new Date(t.registrationClosesAt), "d MMM yyyy")
    : "—";

  const opensAt = t.registrationOpensAt
    ? new Date(t.registrationOpensAt)
    : null;
  const closesAt = t.registrationClosesAt
    ? new Date(t.registrationClosesAt)
    : null;

  let status: CardTournament["status"] = "closed";
  if (t.status === "completed" || t.status === "archived") {
    status = "completed";
  } else if (
    isRegistrationOpen({
      status: t.status,
      registrationOpensAt: opensAt,
      registrationClosesAt: closesAt,
    })
  ) {
    const threeDays = 3 * 24 * 60 * 60 * 1000;
    status =
      closesAt && closesAt.getTime() - Date.now() < threeDays
        ? "closing-soon"
        : "open";
  }

  return {
    id: t.slug,
    name: t.name,
    date,
    venue: t.venueName,
    categories: (t.categories || []).map((c) => c.name),
    registrationDeadline: closes,
    status,
    image: t.bannerUrl || t.posterUrl || "",
    description: t.description,
    past: status === "completed",
  };
}
