"use client";

import Link from "next/link";
import { champions, playerRankings, recentResults } from "@/content/rankings";
import { AnimatedContent } from "@/components/motion/AnimatedContent";
import { BlurText } from "@/components/motion/BlurText";

export function RankingsPreview() {
  const top = [
    ...playerRankings.filter((r) => r.category === "Men's Singles").slice(0, 3),
    ...playerRankings
      .filter((r) => r.category === "Women's Singles")
      .slice(0, 3),
  ];

  return (
    <section className="section-pad bg-footer text-white">
      <div className="container-max">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/40">
              Results
            </p>
            <BlurText
              text="Rankings & achievements"
              className="mt-4 text-[clamp(1.85rem,4vw,3.25rem)] leading-[1.05] !text-white"
            />
            <AnimatedContent delay={0.1}>
              <p className="mt-4 text-white/50">
                Verified champions, recent outcomes and the current ladder.
              </p>
            </AnimatedContent>
          </div>
          <AnimatedContent delay={0.15}>
            <Link
              href="/rankings"
              className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-sun transition hover:text-white"
            >
              Full rankings
              <span
                className="transition-transform duration-300 group-hover:translate-x-0.5"
                aria-hidden
              >
                →
              </span>
            </Link>
          </AnimatedContent>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-3 lg:gap-12">
          <AnimatedContent>
            <Link href="/rankings" className="group block h-full outline-offset-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/35">
                Champions
              </p>
              <ul className="mt-5 space-y-5">
                {champions.map((c) => (
                  <li
                    key={`${c.tournament}-${c.category}`}
                    className="border-b border-white/10 pb-5 last:border-0"
                  >
                    <p className="font-medium transition-colors group-hover:text-sun">
                      {c.winners}
                    </p>
                    <p className="mt-1 text-sm text-white/40">
                      {c.category} · {c.year}
                    </p>
                  </li>
                ))}
              </ul>
            </Link>
          </AnimatedContent>

          <AnimatedContent delay={0.08}>
            <Link href="/rankings" className="group block h-full outline-offset-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/35">
                Recent results
              </p>
              <ul className="mt-5 space-y-5">
                {recentResults.map((r) => (
                  <li
                    key={r.id}
                    className="border-b border-white/10 pb-5 last:border-0"
                  >
                    <p className="font-medium">{r.title}</p>
                    <p className="mt-1 text-sm text-white/40">{r.date}</p>
                  </li>
                ))}
              </ul>
            </Link>
          </AnimatedContent>

          <AnimatedContent delay={0.16}>
            <Link href="/rankings" className="group block h-full outline-offset-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/35">
                Ladder snapshot
              </p>
              <ul className="mt-5 space-y-3">
                {top.map((row) => (
                  <li
                    key={`${row.category}-${row.rank}-${row.name}`}
                    className="flex items-baseline justify-between gap-4 border-b border-white/10 py-2.5 text-sm"
                  >
                    <span>
                      <span className="mr-3 tabular-nums text-white/35">
                        {String(row.rank).padStart(2, "0")}
                      </span>
                      {row.name}
                      <span className="ml-2 text-white/30">
                        {row.category.split(" ")[0]}
                      </span>
                    </span>
                    <span className="tabular-nums text-white/40">
                      {row.points}
                    </span>
                  </li>
                ))}
              </ul>
            </Link>
          </AnimatedContent>
        </div>
      </div>
    </section>
  );
}
