import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/layout/PageHero";
import { committee } from "@/content/committee";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "About ATPA",
  description: "Mission, objectives and committee of Amateur Telangana Pickleball Association.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About ATPA"
        title="One association. A growing community."
        description={site.mission}
      />
      <section className="section-pad bg-sand">
        <div className="container-wide grid gap-12 lg:grid-cols-2">
          <div className="space-y-4 text-slate">
            <h2 className="font-display text-2xl font-bold text-ink">
              Our mission
            </h2>
            <p>
              We promote pickleball as a healthy lifestyle and competitive sport
              for every age group — beginners, club players and professionals
              alike.
            </p>
            <p>
              Growth comes through organising tournaments, conducting coaching
              workshops, and creating development opportunities across Telangana
              while remaining affiliated with {site.affiliation}.
            </p>
            <div className="relative mt-6 aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src="/hero/about-event.jpg"
                alt="ATPA event"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>

          <div>
            <h2 className="font-display text-2xl font-bold text-ink">
              ATPA Executive Committee
            </h2>
            <ul className="mt-6 space-y-4">
              {committee.map((member) => (
                <li
                  key={member.role}
                  className="rounded-xl border border-ink/8 bg-white p-4"
                >
                  <p className="text-xs font-semibold uppercase tracking-wider text-court">
                    {member.role}
                  </p>
                  <ul className="mt-2 space-y-1">
                    {member.names.map((n) => (
                      <li key={n} className="font-medium text-ink">
                        {n}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
