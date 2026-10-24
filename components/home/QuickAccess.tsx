"use client";

import Link from "next/link";
import { AnimatedContent } from "@/components/motion/AnimatedContent";
import { BlurText } from "@/components/motion/BlurText";

const items = [
  {
    href: "/tournaments",
    num: "01",
    title: "Tournaments",
    copy: "Official fixtures, entry windows and results.",
  },
  {
    href: "/register",
    num: "02",
    title: "Membership",
    copy: "Register once and compete across the season.",
  },
  {
    href: "/rankings",
    num: "03",
    title: "Rankings",
    copy: "Published ladders and verified match outcomes.",
  },
  {
    href: "/clubs",
    num: "04",
    title: "Clubs & courts",
    copy: "Affiliated venues and coaching across Telangana.",
  },
];

export function QuickAccess() {
  return (
    <section className="section-pad section-live bg-paper">
      <div className="container-max">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted">
          Explore
        </p>
        <BlurText
          text="Built for every kind of player."
          className="mt-3 max-w-[16ch] text-[clamp(1.85rem,4vw,3.25rem)] leading-[1.05] text-ink"
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => (
            <AnimatedContent key={item.href} delay={i * 0.07}>
              <Link
                href={item.href}
                style={{ animationDelay: `${i * 0.45}s` }}
                className="group motion-card flex h-full flex-col rounded-2xl border border-ink/10 bg-white p-6 shadow-[0_10px_30px_-22px_rgba(15,26,44,0.45)] outline-offset-4 transition duration-300 hover:-translate-y-1 hover:border-leaf/35 hover:shadow-[0_22px_44px_-24px_rgba(15,26,44,0.4)]"
              >
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-leaf-soft text-[11px] font-bold tracking-[0.12em] text-leaf">
                  {item.num}
                </span>
                <h3 className="mt-5 text-2xl font-semibold tracking-[-0.03em] text-ink transition-colors duration-300 group-hover:text-leaf">
                  {item.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                  {item.copy}
                </p>
                <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-leaf">
                  Explore
                  <span
                    className="inline-block transition-transform duration-300 group-hover:translate-x-1"
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
