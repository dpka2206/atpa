"use client";

import Image from "next/image";
import Link from "next/link";
import { clubs } from "@/content/clubs";
import { AnimatedContent } from "@/components/motion/AnimatedContent";
import { BlurText } from "@/components/motion/BlurText";
import { MediaReveal } from "@/components/motion/MediaReveal";

export function ClubsPreview() {
  return (
    <section className="section-pad bg-white">
      <div className="container-max">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted">
              Places to play
            </p>
            <BlurText
              text="Clubs, courts & coaching"
              className="mt-4 text-[clamp(1.85rem,4vw,3.25rem)] leading-[1.05] text-ink"
            />
            <AnimatedContent delay={0.1}>
              <p className="mt-4 text-muted">
                Affiliated facilities welcoming beginners and competitive players
                alike.
              </p>
            </AnimatedContent>
          </div>
          <AnimatedContent delay={0.15}>
            <Link
              href="/clubs"
              className="group inline-flex shrink-0 items-center gap-1.5 rounded-full bg-sun px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-sun-deep"
            >
              Browse venues
              <span
                className="transition-transform duration-300 group-hover:translate-x-0.5"
                aria-hidden
              >
                →
              </span>
            </Link>
          </AnimatedContent>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {clubs.map((club, i) => (
            <AnimatedContent key={club.id} delay={i * 0.08}>
              <Link
                href={`/clubs#${club.id}`}
                className="group block outline-offset-4"
              >
                <MediaReveal scrubScale>
                  <div className="relative aspect-[5/4] overflow-hidden rounded-[1.25rem]">
                    <Image
                      src={club.image}
                      alt={club.name}
                      fill
                      className="object-cover"
                      sizes="33vw"
                    />
                  </div>
                </MediaReveal>
                <div className="pt-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-leaf">
                    {club.type}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-ink transition-colors group-hover:text-leaf">
                    {club.name}
                  </h3>
                  <p className="mt-1 text-sm text-muted">{club.location}</p>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    {club.description}
                  </p>
                </div>
              </Link>
            </AnimatedContent>
          ))}
        </div>
      </div>
    </section>
  );
}
