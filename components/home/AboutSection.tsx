"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatedContent } from "@/components/motion/AnimatedContent";
import { BlurText } from "@/components/motion/BlurText";
import { MediaReveal } from "@/components/motion/MediaReveal";

export function AboutSection() {
  return (
    <section className="section-pad bg-white">
      <div className="container-max grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <MediaReveal className="lg:col-span-6" scrubScale>
          <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] md:aspect-[5/6]">
            <Image
              src="/hero/about-event.jpg"
              alt="ATPA association gathering"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 45vw"
            />
          </div>
        </MediaReveal>

        <div className="lg:col-span-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted">
            About ATPA
          </p>
          <BlurText
            text="One association for a growing pickleball community."
            className="mt-4 text-[clamp(1.85rem,3.8vw,3rem)] leading-[1.06] text-ink"
          />
          <AnimatedContent delay={0.12}>
            <div className="mt-6 space-y-4 text-base leading-relaxed text-muted md:text-[17px]">
              <p>
                Amateur Telangana Pickleball Association promotes the sport
                across the state — organising tournaments, supporting clubs, and
                creating fair pathways for every age and ability.
              </p>
              <p>
                Affiliated with the All India Pickleball Association, we work to
                expand grassroots participation while raising the standard of
                competitive play.
              </p>
            </div>
            <Link
              href="/about"
              className="group mt-9 inline-flex items-center gap-2 rounded-full bg-leaf px-6 py-3 text-sm font-semibold text-white transition hover:bg-ink"
            >
              Learn about ATPA
              <span
                className="transition-transform duration-300 group-hover:translate-x-0.5"
                aria-hidden
              >
                →
              </span>
            </Link>
          </AnimatedContent>
        </div>
      </div>
    </section>
  );
}
