"use client";

import Link from "next/link";
import { news } from "@/content/news";
import { AnimatedContent } from "@/components/motion/AnimatedContent";
import { BlurText } from "@/components/motion/BlurText";

export function NewsPreview() {
  return (
    <section className="section-pad bg-paper">
      <div className="container-max">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted">
              News
            </p>
            <BlurText
              text="Latest announcements"
              className="mt-4 text-[clamp(1.85rem,4vw,3.25rem)] leading-[1.05] text-ink"
            />
          </div>
          <AnimatedContent delay={0.1}>
            <Link
              href="/news"
              className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-leaf"
            >
              All news
              <span
                className="transition-transform duration-300 group-hover:translate-x-0.5"
                aria-hidden
              >
                →
              </span>
            </Link>
          </AnimatedContent>
        </div>

        <div className="mt-12 divide-y divide-ink/[0.08] border-y border-ink/[0.08]">
          {news.slice(0, 3).map((item, i) => (
            <AnimatedContent key={item.id} delay={i * 0.06}>
              <Link
                href={item.href}
                className="group grid gap-3 py-8 transition-colors md:grid-cols-[7rem_1fr_auto] md:items-baseline md:gap-8"
              >
                <time className="text-sm text-muted">{item.date}</time>
                <div>
                  <h3 className="text-xl font-semibold tracking-[-0.03em] text-ink transition-colors duration-300 group-hover:text-leaf md:text-2xl">
                    {item.title}
                  </h3>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted md:text-base">
                    {item.excerpt}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-leaf md:justify-self-end">
                  Read
                  <span
                    className="transition-transform duration-300 group-hover:translate-x-1"
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
