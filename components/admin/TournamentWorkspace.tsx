"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { TournamentForm } from "@/components/admin/TournamentForm";
import { RegistrationsPanel } from "@/components/admin/RegistrationsPanel";
import { FormConfigPanel } from "@/components/admin/FormConfigPanel";
import { DEFAULT_FORM_FIELDS } from "@/lib/constants";

type Tab =
  | "overview"
  | "registrations"
  | "categories"
  | "form"
  | "settings";

type Props = {
  tournament: Record<string, unknown> & {
    _id: string;
    name: string;
    slug: string;
    status: string;
    categories?: Array<Record<string, unknown>>;
    formConfig?: {
      fields?: Record<string, { enabled: boolean; required: boolean }>;
      successMessage?: string;
      emailSubjectTemplate?: string;
    };
  };
};

const tabs: { id: Tab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "registrations", label: "Registrations" },
  { id: "categories", label: "Categories" },
  { id: "form", label: "Form settings" },
  { id: "settings", label: "Settings" },
];

export function TournamentWorkspace({ tournament }: Props) {
  const [tab, setTab] = useState<Tab>("overview");
  const initialFields = useMemo(() => {
    return {
      ...structuredClone(DEFAULT_FORM_FIELDS),
      ...(tournament.formConfig?.fields || {}),
    };
  }, [tournament.formConfig?.fields]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link
            href="/admin/tournaments"
            className="text-sm text-muted hover:text-ink"
          >
            ← All tournaments
          </Link>
          <h1 className="mt-2 font-display text-3xl">{tournament.name}</h1>
          <p className="mt-1 text-sm text-muted">
            {tournament.slug} ·{" "}
            <span className="rounded bg-leaf-soft px-2 py-0.5 text-xs font-medium text-leaf">
              {tournament.status.replaceAll("_", " ")}
            </span>
          </p>
        </div>
        <Link
          href={`/tournaments/${tournament.slug}`}
          target="_blank"
          className="rounded-md border border-ink/15 bg-white px-3 py-2 text-sm font-medium hover:bg-canvas"
        >
          View public page
        </Link>
      </div>

      <div className="flex flex-wrap gap-1 border-b border-ink/10 pb-px">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`rounded-t-md px-3 py-2 text-sm font-medium ${
              tab === t.id
                ? "border border-b-white border-ink/10 bg-white text-ink"
                : "text-muted hover:text-ink"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "overview" || tab === "settings" ? (
        <TournamentForm
          mode="edit"
          tournamentId={String(tournament._id)}
          initial={tournament}
        />
      ) : null}

      {tab === "categories" ? (
        <div className="rounded-xl border border-ink/8 bg-white p-5">
          <p className="mb-4 text-sm text-muted">
            Edit categories from the Overview form. Current categories:
          </p>
          <ul className="divide-y divide-ink/8">
            {(tournament.categories || []).map((c) => (
              <li
                key={String(c._id || c.key)}
                className="flex items-center justify-between py-3 text-sm"
              >
                <span className="font-medium">{String(c.name)}</span>
                <span className="text-muted">
                  {String(c.type).replaceAll("_", " ")} · ₹{Number(c.fee || 0)}
                  {c.maxEntries ? ` · max ${c.maxEntries}` : ""}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {tab === "registrations" ? (
        <RegistrationsPanel tournamentId={String(tournament._id)} />
      ) : null}

      {tab === "form" ? (
        <FormConfigPanel
          tournamentId={String(tournament._id)}
          initialFields={initialFields}
          successMessage={
            tournament.formConfig?.successMessage ||
            "Thank you for registering with ATPA. Check your email for your registration confirmation."
          }
          emailSubjectTemplate={
            tournament.formConfig?.emailSubjectTemplate ||
            "ATPA Tournament Registration Received — {{tournamentName}}"
          }
        />
      ) : null}
    </div>
  );
}
