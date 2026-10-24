"use client";

import Image from "next/image";
import { partners } from "@/content/partners";
import { AnimatedContent } from "@/components/motion/AnimatedContent";

export function Partners() {
  return (
    <section className="bg-paper py-16">
      <div className="container-max px-5 md:px-8 lg:px-14">
        <AnimatedContent>
          <p className="mb-10 text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-muted">
            Affiliation
          </p>
          <div className="flex flex-wrap items-center justify-center gap-12 md:gap-16">
            {partners.map((p) => (
              <a
                key={p.id}
                href={p.href ?? "#"}
                className="opacity-70 transition hover:opacity-100"
                title={p.name}
              >
                <Image
                  src={p.logo}
                  alt={p.name}
                  width={100}
                  height={100}
                  className="h-14 w-auto object-contain"
                />
              </a>
            ))}
            <div className="flex items-center gap-3 opacity-80">
              <Image
                src="/logos/atpa.jpg"
                alt="ATPA"
                width={64}
                height={64}
                className="h-12 w-auto rounded-md object-contain"
              />
              <p className="max-w-[11rem] text-xs leading-snug text-muted">
                Affiliated with All India Pickleball Association
              </p>
            </div>
          </div>
        </AnimatedContent>
      </div>
    </section>
  );
}
