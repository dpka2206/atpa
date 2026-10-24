"use client";

import { AnimatedContent } from "@/components/motion/AnimatedContent";
import { PickleballIcon } from "@/components/ui/Pickleball";

const quotes = [
  {
    name: "Ananya R.",
    role: "Open Doubles",
    text: "ATPA events feel organised and welcoming — I went from open play to my first draw in one season.",
  },
  {
    name: "Karthik M.",
    role: "Club coach",
    text: "Clear calendars and fair categories make it easy to bring juniors into proper competition.",
  },
  {
    name: "Sneha P.",
    role: "35+ Singles",
    text: "Finally an association voice for Telangana pickleball. The community energy is real.",
  },
];

export function CourtTalk() {
  return (
    <section className="section-pad bg-white">
      <div className="container-wide">
        <AnimatedContent>
          <p className="text-4xl font-semibold tracking-[-0.04em] text-leaf md:text-6xl">
            FROM THE COURT.
          </p>
          <p className="mt-3 max-w-md text-muted">
            Voices from players and coaches in the ATPA network.
          </p>
        </AnimatedContent>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {quotes.map((q, i) => (
            <AnimatedContent key={q.name} delay={i * 0.08}>
              <blockquote className="flex h-full flex-col rounded-[1.75rem] bg-mint p-6">
                <PickleballIcon className="h-6 w-6 text-leaf" fill="currentColor" />
                <p className="mt-5 flex-1 text-[15px] leading-relaxed text-ink">
                  &ldquo;{q.text}&rdquo;
                </p>
                <footer className="mt-6 border-t border-ink/8 pt-4">
                  <p className="font-bold text-ink">{q.name}</p>
                  <p className="text-xs text-muted">{q.role}</p>
                </footer>
              </blockquote>
            </AnimatedContent>
          ))}
        </div>
      </div>
    </section>
  );
}
