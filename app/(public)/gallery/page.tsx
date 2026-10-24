import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/layout/PageHero";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Tournament highlights, player photographs, awards and community moments from ATPA.",
};

const album = [
  {
    src: "/gallery/IMG-20250226-WA0024.jpg",
    label: "Tournament highlights",
  },
  {
    src: "/gallery/IMG-20250226-WA0023.jpg",
    label: "Player and team photographs",
  },
  {
    src: "/gallery/IMG-20250226-WA0018.jpg",
    label: "Award ceremonies and winners",
  },
  {
    src: "/gallery/IMG-20250226-WA0007.jpg",
    label: "Community events",
  },
  {
    src: "/gallery/IMG-20250226-WA0016.jpg",
    label: "Coaching camps",
  },
  {
    src: "/gallery/IMG-20250226-WA0013.jpg",
    label: "Match play",
  },
  {
    src: "/gallery/IMG-20250226-WA0006.jpg",
    label: "On court",
  },
  {
    src: "/gallery/IMG-20250226-WA0022.jpg",
    label: "Association events",
  },
  {
    src: "/hero/pickleball-action.jpg",
    label: "Video highlights still",
  },
  {
    src: "/gallery/wa-614f.jpg",
    label: "Community",
  },
  {
    src: "/gallery/IMG-20250226-WA0014.jpg",
    label: "Players",
  },
  {
    src: "/hero/about-event.jpg",
    label: "Gatherings",
  },
];

export default function GalleryPage() {
  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title="Moments on the court"
        description="Tournament highlights, player and team photographs, award ceremonies, community events and coaching camps."
      />
      <section className="section-pad bg-canvas">
        <div className="container-max grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {album.map((item) => (
            <figure
              key={item.src}
              className="overflow-hidden rounded-2xl bg-surface ring-1 ring-ink/[0.06]"
            >
              <div className="relative aspect-[4/3]">
                <Image
                  src={item.src}
                  alt={item.label}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 50vw, 33vw"
                />
              </div>
              <figcaption className="px-4 py-3 text-sm text-muted">
                {item.label}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
    </>
  );
}
