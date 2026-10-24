import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import { PageHero } from "@/components/layout/PageHero";
import { RegistrationForm } from "@/components/register/RegistrationForm";
import { getOpenRegistrationTournaments } from "@/lib/tournaments/queries";

export const metadata: Metadata = {
  title: "Register Now",
  description:
    "Register for an ATPA tournament. Confirmation is emailed with your registration ID.",
};

type Props = {
  searchParams: Promise<{ tournament?: string }>;
};

async function RegisterFormLoader({ searchParams }: Props) {
  await connection();
  const { tournament: initialSlug } = await searchParams;

  let tournaments: Array<{
    _id: string;
    slug: string;
    name: string;
    venueName: string;
    startDate: string;
    categories: Array<{
      _id: string;
      key: string;
      name: string;
      type: string;
      fee?: number;
    }>;
    formConfig?: {
      fields?: Record<string, { enabled?: boolean; required?: boolean }>;
      successMessage?: string;
    };
  }> = [];

  try {
    const docs = await getOpenRegistrationTournaments();
    tournaments = JSON.parse(JSON.stringify(docs));
  } catch {
    tournaments = [];
  }

  return (
    <RegistrationForm tournaments={tournaments} initialSlug={initialSlug} />
  );
}

export default function RegisterPage({ searchParams }: Props) {
  return (
    <>
      <PageHero
        eyebrow="Tournament Registration"
        title="Register for an ATPA event"
        description="Choose an open tournament, complete the form, and receive your registration confirmation by email."
      />
      <section className="section-pad bg-sand">
        <div className="container-narrow max-w-2xl">
          <Suspense
            fallback={
              <p className="text-sm text-muted">Loading registration form…</p>
            }
          >
            <RegisterFormLoader searchParams={searchParams} />
          </Suspense>
        </div>
      </section>
    </>
  );
}
