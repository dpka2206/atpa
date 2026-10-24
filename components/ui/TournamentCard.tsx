"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Tournament } from "@/lib/types";
import { TournamentPoster } from "@/components/ui/TournamentPoster";

const statusLabel: Record<Tournament["status"], string> = {
  open: "Open",
  "closing-soon": "Closing soon",
  closed: "Closed",
  completed: "Completed",
};

export function TournamentCard({ tournament }: { tournament: Tournament }) {
  const canEnter =
    tournament.status === "open" || tournament.status === "closing-soon";
  const detailsHref = `/tournaments/${tournament.id}`;

  return (
    <motion.article
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.25, margin: "0px 0px -8% 0px" }}
      whileHover={{ y: -8, transition: { duration: 0.28 } }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="group flex h-full flex-col overflow-hidden rounded-[1.25rem] bg-white ring-1 ring-ink/[0.06] transition-shadow duration-300 hover:shadow-[0_24px_48px_-28px_rgba(15,26,44,0.28)] hover:ring-leaf/25"
    >
      <Link
        href={detailsHref}
        className="relative block aspect-[16/10] overflow-hidden bg-canvas-deep"
      >
        <TournamentPoster
          name={tournament.name}
          src={tournament.image}
          className="transition-transform duration-700 group-hover:scale-[1.05]"
        />
        <span className="absolute left-4 top-4 rounded-full bg-surface/95 px-3 py-1 text-[11px] font-semibold text-ink backdrop-blur">
          {statusLabel[tournament.status]}
        </span>
        <span className="absolute bottom-4 right-4 inline-flex items-center gap-1 rounded-full bg-ink/85 px-3 py-1.5 text-[11px] font-semibold text-white opacity-0 backdrop-blur transition duration-300 group-hover:opacity-100">
          View details
          <span aria-hidden>→</span>
        </span>
      </Link>
      <div className="flex flex-1 flex-col p-6">
        <Link href={detailsHref}>
          <h3 className="font-display text-[1.35rem] leading-snug text-ink transition-colors group-hover:text-accent">
            {tournament.name}
          </h3>
        </Link>
        <p className="mt-3 text-sm font-medium text-ink">{tournament.date}</p>
        <p className="mt-0.5 text-sm text-muted">{tournament.venue}</p>
        <p className="mt-4 text-sm leading-relaxed text-muted">
          {tournament.categories.join(" · ")}
        </p>
        <p className="mt-3 text-xs text-muted">
          Registration closes{" "}
          <span className="font-semibold text-ink">
            {tournament.registrationDeadline}
          </span>
        </p>
        <div className="mt-auto flex flex-wrap gap-3 pt-6">
          <Link
            href={detailsHref}
            className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white transition hover:bg-ink-soft"
          >
            Details
            <span aria-hidden>→</span>
          </Link>
          {canEnter ? (
            <Link
              href={`/register?tournament=${tournament.id}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 px-4 py-2 text-sm font-semibold text-accent transition hover:border-accent hover:bg-accent-soft"
            >
              Enter
              <span aria-hidden>→</span>
            </Link>
          ) : null}
        </div>
      </div>
    </motion.article>
  );
}

export function TournamentEmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-ink/15 bg-canvas px-6 py-16 text-center">
      <p className="font-display text-2xl text-ink">No upcoming events yet</p>
      <p className="mx-auto mt-3 max-w-md text-muted">
        New fixtures will appear here when announced. Browse past tournaments in
        the meantime.
      </p>
      <Link
        href="/tournaments#past"
        className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-accent"
      >
        View past tournaments
        <span aria-hidden>→</span>
      </Link>
    </div>
  );
}
