"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatedContent } from "@/components/motion/AnimatedContent";
import { BlurText } from "@/components/motion/BlurText";
import { MediaReveal } from "@/components/motion/MediaReveal";

const moments = [
  {
    src: "/gallery/IMG-20250226-WA0024.jpg",
    label: "Tournament highlights",
    span: "md:col-span-2 md:row-span-2",
  },
  {
    src: "/gallery/IMG-20250226-WA0023.jpg",
    label: "Player photographs",
    span: "",
  },
  {
    src: "/gallery/IMG-20250226-WA0018.jpg",
    label: "Award ceremonies",
    span: "",
  },
  {
    src: "/gallery/IMG-20250226-WA0007.jpg",
    label: "Community events",
    span: "md:col-span-2",
  },
  {
    src: "/gallery/IMG-20250226-WA0016.jpg",
    label: "Coaching camps",
    span: "",
  },
  {
    src: "/gallery/IMG-20250226-WA0013.jpg",
    label: "Match day",
    span: "",
  },
];

export function Gallery() {
  return (
    <section id="gallery" className="section-pad section-live bg-mint-2">
      <div className="container-max">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted">
              Gallery
            </p>
            <BlurText
              text="Moments on the court"
              className="mt-3 text-[clamp(1.85rem,4vw,3.25rem)] leading-[1.05] text-ink"
            />
            <AnimatedContent delay={0.1}>
              <p className="mt-4 text-muted">
                Highlights from tournaments, ceremonies and coaching across
                Telangana.
              </p>
            </AnimatedContent>
          </div>
          <AnimatedContent delay={0.15}>
            <Link
              href="/gallery"
              className="group inline-flex shrink-0 items-center gap-1.5 rounded-full bg-sun px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-sun-deep"
            >
              View full gallery
              <span
                className="transition-transform duration-300 group-hover:translate-x-0.5"
                aria-hidden
              >
                →
              </span>
            </Link>
          </AnimatedContent>
        </div>

        <div className="mt-12 grid auto-rows-[180px] gap-3 md:grid-cols-4 md:auto-rows-[200px]">
          {moments.map((m, i) => (
            <AnimatedContent
              key={m.src}
              delay={i * 0.05}
              className={m.span}
            >
              <Link
                href="/gallery"
                className="group relative block h-full min-h-[180px] overflow-hidden rounded-[1.25rem]"
              >
                <MediaReveal scrubScale className="h-full">
                  <div className="relative h-full min-h-[180px]">
                    <Image
                      src={m.src}
                      alt={m.label}
                      fill
                      className="object-cover transition duration-700 group-hover:scale-[1.04]"
                      sizes="(max-width: 768px) 100vw, 40vw"
                    />
                  </div>
                </MediaReveal>
                <span className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-end justify-between bg-gradient-to-t from-ink/80 to-transparent px-4 pb-4 pt-14 text-sm font-medium text-white">
                  <span>{m.label}</span>
                  <span
                    className="translate-y-1 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100"
                    aria-hidden
                  >
                    →
                  </span>
                </span>
              </Link>
            </AnimatedContent>
          ))}
        </div>
      </div>
    </section>
  );
}
