import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/layout/PageHero";
import { Button } from "@/components/ui/Button";
import { clubs } from "@/content/clubs";

export const metadata: Metadata = {
  title: "Clubs & Courts",
  description: "Find affiliated pickleball clubs, courts and coaching in Telangana.",
};

export default function ClubsPage() {
  return (
    <>
      <PageHero
        eyebrow="Clubs & Courts"
        title="Find your place on the court"
        description="Featured affiliated clubs, venues and coaching programmes across Telangana."
      />
      <section className="section-pad bg-sand">
        <div className="container-wide">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {clubs.map((club) => (
              <article
                key={club.id}
                id={club.id}
                className="scroll-mt-28 overflow-hidden rounded-xl border border-ink/8 bg-white"
              >
                <div className="relative aspect-[16/10]">
                  <Image
                    src={club.image}
                    alt={club.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-court">
                    {club.type}
                  </p>
                  <h2 className="mt-1 font-display text-xl font-bold text-ink">
                    {club.name}
                  </h2>
                  <p className="mt-1 text-sm text-slate">{club.location}</p>
                  <p className="mt-3 text-sm leading-relaxed text-slate">
                    {club.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-10">
            <Button href="/contact" variant="accent">
              List your venue
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
