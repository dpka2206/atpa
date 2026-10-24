"use client";

import { useState } from "react";
import { AnimatedContent } from "@/components/motion/AnimatedContent";
import { BlurText } from "@/components/motion/BlurText";

const faqs = [
  {
    q: "Who can join ATPA?",
    a: "Players of all ages and abilities across Telangana. Membership opens access to sanctioned tournaments, published rankings, and association updates.",
  },
  {
    q: "How do I enter a tournament?",
    a: "Register as an ATPA member, then enter any event marked open on the tournaments page before the registration deadline.",
  },
  {
    q: "How do rankings work?",
    a: "Results from sanctioned events feed the ladder. Category standings and recent outcomes are published on the Rankings & Results page.",
  },
  {
    q: "Can my club affiliate with ATPA?",
    a: "Yes. Clubs, courts and academies can connect with the association for event hosting, coaching pathways and statewide visibility. Use Contact or Become a Partner.",
  },
  {
    q: "Where is ATPA based?",
    a: "Ashiana Residency, Kamalapuri Colony, Hyderabad. Reach us by email or phone on weekdays 10am–5pm.",
  },
];

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="section-pad bg-white">
      <div className="container-max grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted">
            FAQ
          </p>
          <BlurText
            text="Straight answers before you play."
            className="mt-3 text-[clamp(1.7rem,3.4vw,2.65rem)] leading-[1.06] text-ink"
          />
          <AnimatedContent delay={0.1}>
            <p className="mt-4 text-muted">
              Quick answers for players, clubs and first-time visitors.
            </p>
          </AnimatedContent>
        </div>

        <div className="lg:col-span-8">
          <ul className="divide-y divide-ink/[0.08] border-y border-ink/[0.08]">
            {faqs.map((item, i) => {
              const isOpen = open === i;
              return (
                <AnimatedContent key={item.q} delay={i * 0.04}>
                  <li>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="flex w-full cursor-pointer items-start justify-between gap-6 py-5 text-left transition-colors hover:text-leaf"
                    >
                      <span className="font-medium text-ink md:text-[17px]">
                        {item.q}
                      </span>
                      <span
                        className={`mt-1 shrink-0 text-lg leading-none text-muted transition ${
                          isOpen ? "rotate-45" : ""
                        }`}
                        aria-hidden
                      >
                        +
                      </span>
                    </button>
                    <div
                      className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                        isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <p className="pb-5 pr-10 text-sm leading-relaxed text-muted md:text-[15px]">
                          {item.a}
                        </p>
                      </div>
                    </div>
                  </li>
                </AnimatedContent>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
