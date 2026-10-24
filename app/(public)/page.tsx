import { AboutSection } from "@/components/home/AboutSection";
import { ClubsPreview } from "@/components/home/ClubsPreview";
import { CommitteeTeaser } from "@/components/home/CommitteeTeaser";
import { FaqSection } from "@/components/home/FaqSection";
import { Gallery } from "@/components/home/Gallery";
import { GetInvolved } from "@/components/home/GetInvolved";
import { Hero } from "@/components/home/Hero";
import { HowToStart } from "@/components/home/HowToStart";
import { NewsPreview } from "@/components/home/NewsPreview";
import { Partners } from "@/components/home/Partners";
import { QuickAccess } from "@/components/home/QuickAccess";
import { RankingsPreview } from "@/components/home/RankingsPreview";
import { Suspense } from "react";
import { UpcomingTournamentsSection } from "@/components/home/UpcomingTournamentsSection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <HowToStart />
      <Suspense
        fallback={
          <section className="section-pad bg-mint-2">
            <div className="container-max text-sm text-muted">
              Loading tournaments…
            </div>
          </section>
        }
      >
        <UpcomingTournamentsSection />
      </Suspense>
      <QuickAccess />
      <AboutSection />
      <CommitteeTeaser />
      <RankingsPreview />
      <ClubsPreview />
      <NewsPreview />
      <Gallery />
      <Partners />
      <FaqSection />
      <GetInvolved />
    </>
  );
}
