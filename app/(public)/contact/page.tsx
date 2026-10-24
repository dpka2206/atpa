import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Contact Amateur Telangana Pickleball Association in Hyderabad.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Get in touch"
        description="Reach the association office for tournaments, membership and academy enquiries."
      />
      <section className="section-pad bg-sand">
        <div className="container-narrow max-w-2xl">
          <div className="rounded-xl border border-ink/8 bg-white p-6 md:p-8">
            <h2 className="font-display text-xl font-bold text-ink">
              {site.name}
            </h2>
            <address className="mt-4 space-y-3 text-sm not-italic text-slate">
              <p>{site.contact.address}</p>
              <p>
                Email:{" "}
                <a
                  href={`mailto:${site.contact.email}`}
                  className="font-medium text-court hover:text-court-bright"
                >
                  {site.contact.email}
                </a>
              </p>
              <p>
                Call: {site.contact.phoneLabel} —{" "}
                <a
                  href={`tel:${site.contact.phone}`}
                  className="font-medium text-court hover:text-court-bright"
                >
                  {site.contact.phone}
                </a>
              </p>
              <p>Office hours: {site.contact.hours}</p>
              <p>Website: {site.contact.website}</p>
            </address>
          </div>
        </div>
      </section>
    </>
  );
}
