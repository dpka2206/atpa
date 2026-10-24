import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { getPublicTournamentBySlug } from "@/lib/tournaments/queries";
import { isRegistrationOpen } from "@/lib/tournaments/queries";
import { TournamentPoster } from "@/components/ui/TournamentPoster";
import { hasTournamentImage } from "@/lib/tournaments/initials";

export const instant = false;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  await connection();
  const { slug } = await params;
  try {
    const tournament = await getPublicTournamentBySlug(slug);
    if (!tournament) return { title: "Tournament" };
    return {
      title: tournament.name,
      description: tournament.description || undefined,
    };
  } catch {
    return { title: "Tournament" };
  }
}

async function TournamentDetail({ params }: Props) {
  await connection();
  const { slug } = await params;

  let tournament = null;
  try {
    tournament = await getPublicTournamentBySlug(slug);
  } catch {
    tournament = null;
  }
  if (!tournament) notFound();

  const open = isRegistrationOpen(tournament);
  const image = tournament.bannerUrl || tournament.posterUrl || "";
  const dateLabel = `${format(new Date(tournament.startDate), "d MMM yyyy")}${
    new Date(tournament.endDate).toDateString() !==
    new Date(tournament.startDate).toDateString()
      ? ` – ${format(new Date(tournament.endDate), "d MMM yyyy")}`
      : ""
  }`;

  return (
    <>
      <section className="relative min-h-[42vh] overflow-hidden bg-ink">
        <div
          className={`absolute inset-0 ${hasTournamentImage(image) ? "opacity-50" : "opacity-100"}`}
        >
          <TournamentPoster
            name={tournament.name}
            src={image}
            priority
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/30" />
        <div className="container-wide relative flex min-h-[42vh] flex-col justify-end pb-12 pt-28">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sun">
            Tournament
          </p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl text-white md:text-5xl">
            {tournament.name}
          </h1>
          <p className="mt-3 text-white/80">
            {dateLabel} · {tournament.venueName}
          </p>
        </div>
      </section>

      <section className="section-pad bg-paper">
        <div className="container-wide grid gap-10 lg:grid-cols-[1.4fr_0.8fr]">
          <div className="space-y-6">
            {tournament.description ? (
              <p className="text-lg leading-relaxed text-muted">
                {tournament.description}
              </p>
            ) : null}
            <div>
              <h2 className="font-display text-2xl">Categories</h2>
              <ul className="mt-3 space-y-2">
                {(tournament.categories || []).map(
                  (c: {
                    _id?: unknown;
                    key?: string;
                    name: string;
                    type: string;
                    fee?: number;
                  }) => (
                  <li
                    key={String(c._id || c.key)}
                    className="flex items-center justify-between rounded-lg border border-ink/8 bg-white px-4 py-3 text-sm"
                  >
                    <span className="font-medium">{c.name}</span>
                    <span className="text-muted">
                      {c.type.replaceAll("_", " ")}
                      {c.fee ? ` · ₹${c.fee}` : ""}
                    </span>
                  </li>
                ),
                )}
              </ul>
            </div>
            {tournament.formatNotes ? (
              <div>
                <h2 className="font-display text-2xl">Format</h2>
                <p className="mt-2 whitespace-pre-wrap text-muted">
                  {tournament.formatNotes}
                </p>
              </div>
            ) : null}
          </div>

          <aside className="h-fit space-y-4 rounded-2xl border border-ink/8 bg-white p-6">
            <h2 className="font-display text-xl">Event details</h2>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-xs text-muted">Venue</dt>
                <dd className="font-medium">{tournament.venueName}</dd>
                {tournament.venueAddress ? (
                  <dd className="text-muted">{tournament.venueAddress}</dd>
                ) : null}
              </div>
              {tournament.reportingTime ? (
                <div>
                  <dt className="text-xs text-muted">Reporting time</dt>
                  <dd>{tournament.reportingTime}</dd>
                </div>
              ) : null}
              {tournament.registrationClosesAt ? (
                <div>
                  <dt className="text-xs text-muted">Registration closes</dt>
                  <dd>
                    {format(
                      new Date(tournament.registrationClosesAt),
                      "d MMM yyyy HH:mm",
                    )}
                  </dd>
                </div>
              ) : null}
              {tournament.contactEmail ? (
                <div>
                  <dt className="text-xs text-muted">Contact</dt>
                  <dd>{tournament.contactEmail}</dd>
                </div>
              ) : null}
            </dl>
            {open ? (
              <Link
                href={`/register?tournament=${tournament.slug}`}
                className="inline-flex w-full items-center justify-center rounded-full bg-ink px-4 py-3 text-sm font-semibold text-white hover:bg-ink-soft"
              >
                Register for this tournament
              </Link>
            ) : (
              <p className="rounded-lg bg-canvas px-3 py-2 text-sm text-muted">
                Registration is not open for this event.
              </p>
            )}
            {tournament.mapLink ? (
              <a
                href={tournament.mapLink}
                target="_blank"
                rel="noreferrer"
                className="block text-center text-sm font-medium text-leaf hover:underline"
              >
                Open map
              </a>
            ) : null}
          </aside>
        </div>
      </section>
    </>
  );
}

export default function TournamentDetailPage({ params }: Props) {
  return (
    <Suspense
      fallback={
        <div className="section-pad container-wide text-sm text-muted">
          Loading tournament…
        </div>
      }
    >
      <TournamentDetail params={params} />
    </Suspense>
  );
}
