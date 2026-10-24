"use client";

import { AnimatedContent } from "@/components/motion/AnimatedContent";
import { site } from "@/content/site";

const facts = [
  { label: "Affiliated with", value: site.affiliation },
  { label: "Focus", value: "Statewide tournaments & clubs" },
  { label: "Based in", value: "Hyderabad, Telangana" },
];

export function TrustStrip() {
  return (
    <div className="border-b border-ink/[0.06]">
      <div className="container-max px-5 md:px-8 lg:px-14">
        <AnimatedContent>
          <ul className="grid divide-y divide-ink/[0.06] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {facts.map((f) => (
              <li
                key={f.label}
                className="px-0 py-6 sm:px-8 sm:py-8 first:sm:pl-0 last:sm:pr-0"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
                  {f.label}
                </p>
                <p className="mt-2 text-sm font-medium leading-snug text-ink md:text-[15px]">
                  {f.value}
                </p>
              </li>
            ))}
          </ul>
        </AnimatedContent>
      </div>
    </div>
  );
}
