import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Terms & Conditions",
};

export default function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Terms & Conditions"
        description="General terms for using the ATPA website and participating in association activities."
      />
      <section className="section-pad bg-sand">
        <div className="container-narrow max-w-3xl space-y-6 text-sm leading-relaxed text-slate">
          <div>
            <h2 className="font-display text-lg font-bold text-ink">
              Website use
            </h2>
            <p className="mt-2">
              Content on this site is provided for informational purposes by{" "}
              {site.name}. Event details, rankings and schedules may be updated
              without prior notice.
            </p>
          </div>
          <div id="refunds">
            <h2 className="font-display text-lg font-bold text-ink">
              Registration & refunds
            </h2>
            <p className="mt-2">
              Tournament entry fees and refund eligibility are governed by each
              event&apos;s published rules. Unless otherwise stated, registration
              fees are non-refundable after the registration deadline.
              Participants must meet category eligibility and code-of-conduct
              requirements set by ATPA.
            </p>
          </div>
          <p className="text-xs text-slate/80">
            Formal terms will be expanded with legal review before production
            launch. Contact {site.contact.email} for clarifications.
          </p>
        </div>
      </section>
    </>
  );
}
