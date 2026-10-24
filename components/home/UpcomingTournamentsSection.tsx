import { connection } from "next/server";
import { UpcomingTournaments } from "@/components/home/UpcomingTournaments";
import { getUpcomingPublicTournaments } from "@/lib/tournaments/queries";
import { mapTournamentToCard } from "@/lib/tournaments/public-map";

export async function UpcomingTournamentsSection() {
  await connection();
  let tournaments: ReturnType<typeof mapTournamentToCard>[] = [];
  try {
    const docs = await getUpcomingPublicTournaments(3);
    tournaments = docs.map((t) => mapTournamentToCard(t));
  } catch {
    tournaments = [];
  }
  return <UpcomingTournaments tournaments={tournaments} />;
}
