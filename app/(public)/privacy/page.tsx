import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        description="How ATPA handles personal information collected through this website."
      />
      <section className="section-pad bg-sand">
        <div className="container-narrow max-w-3xl space-y-4 text-sm leading-relaxed text-slate">
          <p>
            {site.name} (&quot;ATPA&quot;) collects information you provide when
            registering as a player, contacting the association, or subscribing
            to updates. This may include name, email, phone number and city.
          </p>
          <p>
            We use this information solely to administer membership,
            tournaments, communications and association operations. We do not
            sell personal data to third parties.
          </p>
          <p>
            For privacy enquiries, contact{" "}
            <a href={`mailto:${site.contact.email}`} className="text-court">
              {site.contact.email}
            </a>
            .
          </p>
          <p className="text-xs text-slate/80">
            This stub policy will be expanded with formal legal review before
            production launch.
          </p>
        </div>
      </section>
    </>
  );
}
