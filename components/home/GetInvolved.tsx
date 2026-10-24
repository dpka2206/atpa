"use client";

import Link from "next/link";
import { AnimatedContent } from "@/components/motion/AnimatedContent";
import { BlurText } from "@/components/motion/BlurText";
import { site } from "@/content/site";

const whatsappHref = `https://wa.me/91${site.contact.phone.replace(/\D/g, "")}`;

export function GetInvolved() {
  return (
    <section id="get-involved" className="section-pad bg-paper">
      <div className="container-max">
        <div className="max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted">
            Get involved
          </p>
          <BlurText
            text="Join ATPA — or partner with the association."
            className="mt-3 text-[clamp(1.85rem,4vw,3.25rem)] leading-[1.05] text-ink"
          />
          <AnimatedContent delay={0.1}>
            <p className="mt-5 text-base leading-relaxed text-muted md:text-lg">
              Whether you play, coach, organise or sponsor, there is a place for
              you in Telangana pickleball.
            </p>
          </AnimatedContent>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <AnimatedContent delay={0.06}>
            <div className="flex h-full flex-col border-t border-ink/[0.1] pt-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
                Players
              </p>
              <h3 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-ink md:text-3xl">
                Join ATPA
              </h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
                Register as a member to compete in sanctioned tournaments, appear
                on rankings and stay informed on the season calendar.
              </p>
              <Link
                href="/register"
                className="group mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-sun px-6 py-3 text-sm font-semibold text-ink transition hover:bg-sun-deep"
              >
                Become a member
                <span
                  className="transition-transform duration-300 group-hover:translate-x-0.5"
                  aria-hidden
                >
                  →
                </span>
              </Link>
            </div>
          </AnimatedContent>

          <AnimatedContent delay={0.14}>
            <div className="flex h-full flex-col border-t border-ink/[0.1] pt-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
                Partners
              </p>
              <h3 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-ink md:text-3xl">
                Become a partner
              </h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
                Support statewide events, player pathways and grassroots
                programmes. Clubs, academies and sponsors are welcome to connect.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/contact"
                  className="group inline-flex w-fit items-center gap-2 rounded-full bg-leaf px-6 py-3 text-sm font-semibold text-white transition hover:bg-ink"
                >
                  Talk to ATPA
                  <span
                    className="transition-transform duration-300 group-hover:translate-x-0.5"
                    aria-hidden
                  >
                    →
                  </span>
                </Link>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-fit items-center gap-2 rounded-full border border-ink/15 px-6 py-3 text-sm font-semibold text-ink transition hover:border-leaf/40"
                >
                  WhatsApp
                  <span aria-hidden>→</span>
                </a>
              </div>
            </div>
          </AnimatedContent>
        </div>
      </div>
    </section>
  );
}
