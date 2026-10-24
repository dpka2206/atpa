import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { champions, playerRankings, recentResults } from "@/content/rankings";

export const metadata: Metadata = {
  title: "Rankings & Results",
  description: "Official ATPA player rankings, champions and published results.",
};

export default function RankingsPage() {
  return (
    <>
      <PageHero
        eyebrow="Rankings & Results"
        title="Standings and match outcomes"
        description="Current association rankings and recently published tournament results."
      />
      <section className="section-pad bg-sand">
        <div className="container-wide space-y-12">
          <div>
            <h2 className="font-display text-2xl font-bold text-ink">
              Player rankings
            </h2>
            <div className="mt-4 overflow-hidden rounded-xl border border-ink/8 bg-white">
              <table className="w-full text-left text-sm">
                <thead className="bg-mist text-xs uppercase tracking-wider text-slate">
                  <tr>
                    <th className="px-4 py-3">Rank</th>
                    <th className="px-4 py-3">Player</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Points</th>
                  </tr>
                </thead>
                <tbody>
                  {playerRankings.map((r) => (
                    <tr
                      key={`${r.category}-${r.rank}-${r.name}`}
                      className="border-t border-ink/5"
                    >
                      <td className="px-4 py-3 font-mono text-court">#{r.rank}</td>
                      <td className="px-4 py-3 font-medium text-ink">{r.name}</td>
                      <td className="px-4 py-3 text-slate">{r.category}</td>
                      <td className="px-4 py-3 text-slate">{r.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h2 className="font-display text-2xl font-bold text-ink">
                Champions
              </h2>
              <ul className="mt-4 space-y-3">
                {champions.map((c) => (
                  <li
                    key={`${c.tournament}-${c.category}`}
                    className="rounded-xl border border-ink/8 bg-white p-4"
                  >
                    <p className="font-semibold text-ink">{c.winners}</p>
                    <p className="mt-1 text-sm text-slate">
                      {c.category} · {c.tournament} ({c.year})
                    </p>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold text-ink">
                Recent results
              </h2>
              <ul className="mt-4 space-y-3">
                {recentResults.map((r) => (
                  <li
                    key={r.id}
                    className="rounded-xl border border-ink/8 bg-white p-4"
                  >
                    <p className="font-semibold text-ink">{r.title}</p>
                    <p className="mt-1 text-xs text-slate">{r.date}</p>
                    <p className="mt-2 text-sm text-slate">{r.summary}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
