"use client";

import Link from "next/link";
import { AnimatedContent } from "@/components/motion/AnimatedContent";
import { BlurText } from "@/components/motion/BlurText";
import { TrustStrip } from "@/components/home/TrustStrip";

const steps = [
  {
    num: "01",
    title: "Find a court",
    copy: "Browse affiliated clubs, venues and coaching programmes near you.",
    href: "/clubs",
    cta: "Clubs & courts",
  },
  {
    num: "02",
    title: "Become a member",
    copy: "Register once with ATPA to enter sanctioned events and rankings.",
    href: "/register",
    cta: "Register",
  },
  {
    num: "03",
    title: "Enter a tournament",
    copy: "Pick an open fixture, meet the deadline, and compete on the calendar.",
    href: "/tournaments",
    cta: "View tournaments",
  },
];

export function HowToStart() {
  return (
    <section className="overlap-band">
      <TrustStrip />
      <div className="section-pad !pt-14">
        <div className="container-max">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted">
            New here?
          </p>
          <BlurText
            text="Three steps to get on court."
            className="mt-3 max-w-xl text-[clamp(2rem,4.2vw,3.5rem)] leading-[1.05] text-ink"
          />
          <AnimatedContent delay={0.12}>
            <p className="mt-4 max-w-lg text-muted">
              From first rally to your first draw — a clear path into Telangana
              pickleball.
            </p>
          </AnimatedContent>

          <ol className="mt-14 grid gap-5 md:grid-cols-3 md:gap-6">
            {steps.map((s, i) => (
              <AnimatedContent key={s.num} delay={i * 0.08}>
                <li className="h-full">
                  <Link
                    href={s.href}
                    style={{ animationDelay: `${i * 0.55}s` }}
                    className="group motion-card flex h-full flex-col rounded-2xl border border-ink/10 bg-white p-6 shadow-[0_10px_30px_-22px_rgba(15,26,44,0.45)] outline-offset-4 transition duration-300 hover:-translate-y-1 hover:border-leaf/35 hover:shadow-[0_22px_44px_-24px_rgba(15,26,44,0.4)] md:p-7"
                  >
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-leaf-soft text-[11px] font-bold tracking-[0.12em] text-leaf">
                      {s.num}
                    </span>
                    <h3 className="mt-5 text-2xl font-semibold tracking-[-0.03em] text-ink transition-colors group-hover:text-leaf">
                      {s.title}
                    </h3>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
                      {s.copy}
                    </p>
                    <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-leaf">
                      {s.cta}
                      <span
                        className="transition-transform duration-300 group-hover:translate-x-1"
                        aria-hidden
                      >
                        →
                      </span>
                    </span>
                  </Link>
                </li>
              </AnimatedContent>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
