"use client";

import Link from "next/link";
import { committee } from "@/content/committee";
import { AnimatedContent } from "@/components/motion/AnimatedContent";
import { BlurText } from "@/components/motion/BlurText";

export function CommitteeTeaser() {
  const leads = committee.slice(0, 4);

  return (
    <section className="section-pad bg-mint-2">
      <div className="container-max">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted">
              Leadership
            </p>
            <BlurText
              text="The people behind ATPA"
              className="mt-3 text-[clamp(1.85rem,4vw,3.25rem)] leading-[1.05] text-ink"
            />
            <AnimatedContent delay={0.1}>
              <p className="mt-4 text-muted">
                Officers guiding tournaments, membership and growth across
                Telangana.
              </p>
            </AnimatedContent>
          </div>
          <AnimatedContent delay={0.15}>
            <Link
              href="/about"
              className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-leaf"
            >
              Full committee
              <span
                className="transition-transform duration-300 group-hover:translate-x-0.5"
                aria-hidden
              >
                →
              </span>
            </Link>
          </AnimatedContent>
        </div>

        <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {leads.map((m, i) => (
            <AnimatedContent key={m.role} delay={i * 0.06}>
              <li className="border-t border-ink/[0.08] pt-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
                  {m.role}
                </p>
                <ul className="mt-3 space-y-1">
                  {m.names.map((name) => (
                    <li
                      key={name}
                      className="text-xl font-semibold tracking-[-0.03em] text-ink"
                    >
                      {name}
                    </li>
                  ))}
                </ul>
              </li>
            </AnimatedContent>
          ))}
        </ul>
      </div>
    </section>
  );
}
