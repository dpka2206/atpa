"use client";

import { FormEvent, useMemo, useState } from "react";

type Category = {
  _id: string;
  key: string;
  name: string;
  type: string;
  fee?: number;
};

type FormField = { enabled?: boolean; required?: boolean };

type TournamentOption = {
  _id: string;
  slug: string;
  name: string;
  venueName: string;
  startDate: string;
  categories: Category[];
  formConfig?: {
    fields?: Record<string, FormField>;
    successMessage?: string;
  };
};

type Props = {
  tournaments: TournamentOption[];
  initialSlug?: string;
};

function fieldOn(fields: Record<string, FormField> | undefined, key: string) {
  const f = fields?.[key];
  if (!f) return true;
  return f.enabled !== false;
}

function fieldReq(fields: Record<string, FormField> | undefined, key: string) {
  const f = fields?.[key];
  if (!f || f.enabled === false) return false;
  return Boolean(f.required);
}

export function RegistrationForm({ tournaments, initialSlug }: Props) {
  const [slug, setSlug] = useState(
    initialSlug && tournaments.some((t) => t.slug === initialSlug)
      ? initialSlug
      : tournaments[0]?.slug || "",
  );
  const tournament = useMemo(
    () => tournaments.find((t) => t.slug === slug),
    [tournaments, slug],
  );
  const fields = tournament?.formConfig?.fields;
  const [categoryId, setCategoryId] = useState(
    tournament?.categories?.[0]?._id || "",
  );
  const [submittedId, setSubmittedId] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const selectedCategory = tournament?.categories.find(
    (c) => c._id === categoryId,
  );
  const needsPartner =
    selectedCategory?.type === "doubles" ||
    selectedCategory?.type === "mixed_doubles";

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!tournament) return;
    setLoading(true);
    setError("");
    const form = new FormData(e.currentTarget);
    const payload = {
      tournamentSlug: tournament.slug,
      categoryId,
      fullName: String(form.get("fullName") || ""),
      email: String(form.get("email") || ""),
      phone: String(form.get("phone") || ""),
      dateOfBirth: String(form.get("dateOfBirth") || "") || undefined,
      gender: String(form.get("gender") || "") || undefined,
      city: String(form.get("city") || "") || undefined,
      district: String(form.get("district") || "") || undefined,
      emergencyContact: String(form.get("emergencyContact") || "") || undefined,
      skillLevel: String(form.get("skillLevel") || "") || undefined,
      partnerName: String(form.get("partnerName") || "") || undefined,
      membershipId: String(form.get("membershipId") || "") || undefined,
      rulesConsent: form.get("rulesConsent") === "on",
      privacyConsent: form.get("privacyConsent") === "on",
      photoConsent: form.get("photoConsent") === "on",
      idempotencyKey:
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random()}`,
    };

    const res = await fetch("/api/registrations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Registration failed");
      return;
    }
    setSubmittedId(data.registrationId);
    setSuccessMessage(data.successMessage || "Thank you for registering.");
  }

  if (!tournaments.length) {
    return (
      <div className="rounded-2xl border border-ink/10 bg-white p-8 text-center">
        <h2 className="font-display text-2xl text-ink">
          No open registrations
        </h2>
        <p className="mt-3 text-muted">
          There are no tournaments currently accepting registrations. Check
          back when an event opens.
        </p>
      </div>
    );
  }

  if (submittedId) {
    return (
      <div className="rounded-2xl border border-accent/20 bg-accent-soft p-8 text-center">
        <h2 className="font-display text-2xl text-ink">Registration received</h2>
        <p className="mt-3 text-muted">{successMessage}</p>
        <p className="mt-4 font-display text-xl text-ink">{submittedId}</p>
        <p className="mt-2 text-sm text-muted">
          Save this registration ID. A confirmation email has been sent.
        </p>
      </div>
    );
  }

  const inputClass =
    "w-full rounded-md border border-ink/15 bg-sand/50 px-3 py-2.5 outline-none focus:border-court";

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-5 rounded-xl border border-ink/8 bg-white p-6 md:p-8"
    >
      {error ? (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <label className="block text-sm">
        <span className="mb-1.5 block font-medium text-ink">Tournament *</span>
        <select
          value={slug}
          onChange={(e) => {
            setSlug(e.target.value);
            const next = tournaments.find((t) => t.slug === e.target.value);
            setCategoryId(next?.categories?.[0]?._id || "");
          }}
          className={inputClass}
        >
          {tournaments.map((t) => (
            <option key={t._id} value={t.slug}>
              {t.name}
            </option>
          ))}
        </select>
      </label>

      <label className="block text-sm">
        <span className="mb-1.5 block font-medium text-ink">Category *</span>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className={inputClass}
          required
        >
          {(tournament?.categories || []).map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
              {c.fee ? ` (₹${c.fee})` : ""}
            </option>
          ))}
        </select>
      </label>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm sm:col-span-2">
          <span className="mb-1.5 block font-medium text-ink">Full name *</span>
          <input name="fullName" required className={inputClass} />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium text-ink">Email *</span>
          <input name="email" type="email" required className={inputClass} />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium text-ink">
            Mobile number *
          </span>
          <input name="phone" required className={inputClass} />
        </label>

        {fieldOn(fields, "dateOfBirth") ? (
          <label className="block text-sm">
            <span className="mb-1.5 block font-medium text-ink">
              Date of birth
              {fieldReq(fields, "dateOfBirth") ? " *" : ""}
            </span>
            <input
              name="dateOfBirth"
              type="date"
              required={fieldReq(fields, "dateOfBirth")}
              className={inputClass}
            />
          </label>
        ) : null}

        {fieldOn(fields, "gender") ? (
          <label className="block text-sm">
            <span className="mb-1.5 block font-medium text-ink">
              Gender
              {fieldReq(fields, "gender") ? " *" : ""}
            </span>
            <select
              name="gender"
              required={fieldReq(fields, "gender")}
              className={inputClass}
              defaultValue=""
            >
              <option value="">Select</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
              <option>Prefer not to say</option>
            </select>
          </label>
        ) : null}

        {fieldOn(fields, "city") ? (
          <label className="block text-sm">
            <span className="mb-1.5 block font-medium text-ink">
              City{fieldReq(fields, "city") ? " *" : ""}
            </span>
            <input
              name="city"
              required={fieldReq(fields, "city")}
              className={inputClass}
            />
          </label>
        ) : null}

        {fieldOn(fields, "district") ? (
          <label className="block text-sm">
            <span className="mb-1.5 block font-medium text-ink">
              District{fieldReq(fields, "district") ? " *" : ""}
            </span>
            <input
              name="district"
              required={fieldReq(fields, "district")}
              className={inputClass}
            />
          </label>
        ) : null}

        {fieldOn(fields, "skillLevel") ? (
          <label className="block text-sm">
            <span className="mb-1.5 block font-medium text-ink">
              Skill level{fieldReq(fields, "skillLevel") ? " *" : ""}
            </span>
            <select
              name="skillLevel"
              required={fieldReq(fields, "skillLevel")}
              className={inputClass}
              defaultValue=""
            >
              <option value="">Select</option>
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced / Competitive</option>
            </select>
          </label>
        ) : null}

        {fieldOn(fields, "membershipId") ? (
          <label className="block text-sm">
            <span className="mb-1.5 block font-medium text-ink">
              Membership ID{fieldReq(fields, "membershipId") ? " *" : ""}
            </span>
            <input
              name="membershipId"
              required={fieldReq(fields, "membershipId")}
              className={inputClass}
            />
          </label>
        ) : null}

        {fieldOn(fields, "emergencyContact") ? (
          <label className="block text-sm sm:col-span-2">
            <span className="mb-1.5 block font-medium text-ink">
              Emergency contact
              {fieldReq(fields, "emergencyContact") ? " *" : ""}
            </span>
            <input
              name="emergencyContact"
              required={fieldReq(fields, "emergencyContact")}
              className={inputClass}
            />
          </label>
        ) : null}

        {fieldOn(fields, "partnerName") && needsPartner ? (
          <label className="block text-sm sm:col-span-2">
            <span className="mb-1.5 block font-medium text-ink">
              Partner name
              {fieldReq(fields, "partnerName") ? " *" : ""}
            </span>
            <input
              name="partnerName"
              required={fieldReq(fields, "partnerName")}
              className={inputClass}
            />
          </label>
        ) : null}
      </div>

      <div className="space-y-3 border-t border-ink/8 pt-4">
        {fieldOn(fields, "rulesConsent") ? (
          <label className="flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              name="rulesConsent"
              required={fieldReq(fields, "rulesConsent")}
              className="mt-1"
            />
            <span>
              I agree to the tournament rules and code of conduct
              {fieldReq(fields, "rulesConsent") ? " *" : ""}
            </span>
          </label>
        ) : null}
        {fieldOn(fields, "privacyConsent") ? (
          <label className="flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              name="privacyConsent"
              required={fieldReq(fields, "privacyConsent")}
              className="mt-1"
            />
            <span>
              I consent to ATPA processing my registration data
              {fieldReq(fields, "privacyConsent") ? " *" : ""}
            </span>
          </label>
        ) : null}
        {fieldOn(fields, "photoConsent") ? (
          <label className="flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              name="photoConsent"
              required={fieldReq(fields, "photoConsent")}
              className="mt-1"
            />
            <span>
              I consent to event photography / videography
              {fieldReq(fields, "photoConsent") ? " *" : ""}
            </span>
          </label>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:bg-ink-soft disabled:opacity-60"
      >
        {loading ? "Submitting…" : "Submit registration"}
      </button>
      <p className="text-xs text-slate">
        You will receive a confirmation email with your registration ID.
        Payments are verified separately by the association when applicable.
      </p>
    </form>
  );
}
