"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import MorphSlider from "@/components/ui/MorphSlider";
import { site } from "@/content/site";

const heroSlides = [
  {
    image: "/hero/pickleball-action.jpg",
    caption: "Competition across Telangana",
  },
  {
    image: "/gallery/IMG-20250226-WA0024.jpg",
    caption: "LB Stadium — national stage",
  },
  {
    image: "/gallery/IMG-20250226-WA0023.jpg",
    caption: "Match day energy",
  },
  {
    image: "/gallery/IMG-20250226-WA0018.jpg",
    caption: "Community on court",
  },
  {
    image: "/gallery/IMG-20250226-WA0007.jpg",
    caption: "Grassroots to podium",
  },
];

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-paper pb-[12svh] pt-28 md:pt-32">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_20%,color-mix(in_srgb,var(--leaf)_14%,transparent),transparent_55%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-24 top-32 h-72 w-72 rounded-full bg-leaf/5 blur-3xl"
        aria-hidden
      />

      <div className="container-max relative grid min-h-[calc(100svh-6rem)] items-center gap-12 px-5 pb-16 md:px-8 lg:grid-cols-12 lg:gap-10 lg:px-14 lg:pb-20">
        <div className="lg:col-span-5">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
            className="mb-5 text-[11px] font-semibold uppercase tracking-[0.26em] text-muted"
          >
            Amateur Telangana Pickleball Association
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.05, ease }}
            className="font-display text-[clamp(3rem,8vw,5.25rem)] leading-[0.98] tracking-[-0.035em] text-ink"
          >
            {site.shortName}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.14, ease }}
            className="mt-5 font-display text-[clamp(1.35rem,3vw,1.85rem)] leading-snug text-ink/80"
          >
            Growing the game.
            <br />
            Building the community.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.22, ease }}
            className="mt-5 max-w-md text-base leading-relaxed text-muted md:text-lg"
          >
            Tournaments, player pathways, and clubs across Telangana —
            affiliated with {site.affiliation}.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <Link
              href="/tournaments"
              className="group inline-flex items-center gap-2 rounded-full bg-leaf px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-ink"
            >
              View tournaments
              <span
                className="transition-transform duration-300 group-hover:translate-x-0.5"
                aria-hidden
              >
                →
              </span>
            </Link>
            <Link
              href="/register"
              className="group inline-flex items-center gap-2 rounded-full border border-ink/15 bg-white px-7 py-3.5 text-sm font-semibold text-ink transition hover:border-leaf/40"
            >
              Become a member
              <span
                className="text-muted transition group-hover:text-ink"
                aria-hidden
              >
                →
              </span>
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 36, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.12, ease }}
          className="relative h-[min(58svh,520px)] w-full lg:col-span-7 lg:h-[min(74svh,620px)]"
        >
          <MorphSlider
            items={heroSlides}
            transition="melt"
            intensity={0.55}
            aberration={0.32}
            drift={0.4}
            scale={2.4}
            duration={1.1}
            autoplay
            autoplayDelay={4.5}
            loop
            radius={24}
            overlayColor="#0f1a2c"
            showCaptions
            showControls
            showIndicators
            className="h-full w-full shadow-[0_28px_70px_-30px_rgba(17,19,24,0.35)]"
          />
        </motion.div>
      </div>
    </section>
  );
}
