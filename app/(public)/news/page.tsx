import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { news } from "@/content/news";

export const metadata: Metadata = {
  title: "News & Updates",
  description: "ATPA tournament announcements, deadlines and association news.",
};

const categoryLabel = {
  tournament: "Tournament",
  registration: "Registration",
  achievement: "Achievement",
  association: "Association",
} as const;

export default function NewsPage() {
  return (
    <>
      <PageHero
        eyebrow="News & Updates"
        title="Association announcements"
        description="Stay informed about tournaments, registration windows and player achievements."
      />
      <section className="section-pad bg-sand">
        <div className="container-narrow max-w-3xl space-y-4">
          {news.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="block rounded-xl border border-ink/8 bg-white p-5 transition hover:border-court/30"
            >
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-court">
                  {categoryLabel[item.category]}
                </span>
                <time className="text-xs text-slate">{item.date}</time>
              </div>
              <h2 className="mt-2 font-display text-xl font-bold text-ink">
                {item.title}
              </h2>
              <p className="mt-2 text-sm text-slate">{item.excerpt}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
