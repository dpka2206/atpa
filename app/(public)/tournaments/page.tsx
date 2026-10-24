import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import { PageHero } from "@/components/layout/PageHero";
import {
  TournamentCard,
  TournamentEmptyState,
} from "@/components/ui/TournamentCard";
import {
  getPastPublicTournaments,
  getUpcomingPublicTournaments,
} from "@/lib/tournaments/queries";
import { mapTournamentToCard } from "@/lib/tournaments/public-map";

export const metadata: Metadata = {
  title: "Tournaments",
  description:
    "Upcoming and past ATPA pickleball tournaments across Telangana.",
};

async function TournamentLists() {
  await connection();

  let upcoming: ReturnType<typeof mapTournamentToCard>[] = [];
  let past: ReturnType<typeof mapTournamentToCard>[] = [];

  try {
    const [upcomingDocs, pastDocs] = await Promise.all([
      getUpcomingPublicTournaments(20),
      getPastPublicTournaments(),
    ]);
    upcoming = upcomingDocs.map((t) => mapTournamentToCard(t));
    past = pastDocs.map((t) => mapTournamentToCard(t));
  } catch {
    upcoming = [];
    past = [];
  }

  return (
    <section className="section-pad bg-sand">
      <div className="container-wide">
        <h2 className="font-display text-2xl font-bold text-ink">Upcoming</h2>
        {upcoming.length === 0 ? (
          <div className="mt-6">
            <TournamentEmptyState />
          </div>
        ) : (
          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((t) => (
              <div key={t.id} id={t.id}>
                <TournamentCard tournament={t} />
              </div>
            ))}
          </div>
        )}

        <h2
          id="past"
          className="mt-16 font-display text-2xl font-bold text-ink"
        >
          Past tournaments
        </h2>
        <p className="mt-2 max-w-2xl text-slate">
          Completed and archived ATPA events remain available for reference.
        </p>
        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {past.map((t) => (
            <div key={t.id} id={t.id}>
              <TournamentCard tournament={t} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function TournamentsPage() {
  return (
    <>
      <PageHero
        eyebrow="Tournaments"
        title="Official ATPA competitions"
        description="Browse upcoming events, registration status and past championships hosted with the association."
      />
      <Suspense
        fallback={
          <section className="section-pad bg-sand">
            <div className="container-wide text-sm text-muted">
              Loading tournaments…
            </div>
          </section>
        }
      >
        <TournamentLists />
      </Suspense>
    </>
  );
}
