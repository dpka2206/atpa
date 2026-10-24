import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { PageHero } from "@/components/layout/PageHero";

export const metadata: Metadata = {
  title: "Players & Membership",
  description: "Join ATPA as a registered player and compete in official events.",
};

export default function PlayersPage() {
  return (
    <>
      <PageHero
        eyebrow="Players & Membership"
        title="Belong to Telangana pickleball"
        description="Registered players gain access to official tournaments, rankings pathways and association updates."
      />
      <section className="section-pad bg-sand">
        <div className="container-narrow max-w-3xl space-y-6 text-slate">
          <p>
            Amateur Telangana Pickleball Association welcomes beginners,
            recreational players and competitive athletes. Membership connects
            you to statewide events and community programmes.
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>Register once to compete in ATPA-sanctioned tournaments</li>
            <li>Appear on official rankings as results are published</li>
            <li>Receive announcements on events, clinics and coaching</li>
          </ul>
          <div className="pt-4">
            <Button href="/register" variant="accent">
              Become a member
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
