"use client";

import Link from "next/link";
import type { Tournament } from "@/lib/types";
import {
  TournamentCard,
  TournamentEmptyState,
} from "@/components/ui/TournamentCard";
import { AnimatedContent } from "@/components/motion/AnimatedContent";
import { BlurText } from "@/components/motion/BlurText";

export function UpcomingTournaments({
  tournaments = [],
}: {
  tournaments?: Tournament[];
}) {
  return (
    <section id="tournaments" className="section-pad section-live bg-mint-2">
      <div className="container-max">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted">
              Calendar
            </p>
            <BlurText
              text="Upcoming tournaments"
              className="mt-3 text-[clamp(1.85rem,4vw,3.25rem)] leading-[1.05] text-ink"
            />
            <AnimatedContent delay={0.1}>
              <p className="mt-4 text-muted">
                Sanctioned ATPA events with open registration for affiliated
                players.
              </p>
            </AnimatedContent>
          </div>
          <AnimatedContent delay={0.15}>
            <Link
              href="/tournaments"
              className="group mb-2 inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-leaf"
            >
              View all
              <span
                className="transition-transform duration-300 group-hover:translate-x-0.5"
                aria-hidden
              >
                →
              </span>
            </Link>
          </AnimatedContent>
        </div>

        {tournaments.length === 0 ? (
          <AnimatedContent className="mt-12">
            <TournamentEmptyState />
          </AnimatedContent>
        ) : (
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tournaments.map((t, i) => (
              <AnimatedContent key={t.id} delay={i * 0.08}>
                <TournamentCard tournament={t} />
              </AnimatedContent>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
