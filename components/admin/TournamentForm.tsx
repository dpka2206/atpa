"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CATEGORY_TYPES, TOURNAMENT_STATUSES } from "@/lib/constants";
import {
  localInputToIso,
  toDatetimeLocalMin,
  validateTournamentDates,
  type FieldErrors,
} from "@/lib/tournaments/validation";
import { TournamentPoster } from "@/components/ui/TournamentPoster";

type CategoryDraft = {
  key: string;
  name: string;
  type: (typeof CATEGORY_TYPES)[number];
  fee: number;
  maxEntries?: number | null;
};

type Props = {
  mode: "create" | "edit";
  tournamentId?: string;
  initial?: Record<string, unknown>;
};

function toLocalInput(value?: string | Date | null) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-red-600">{message}</p>;
}

function RequiredMark() {
  return <span className="text-red-600"> *</span>;
}

export function TournamentForm({ mode, tournamentId, initial }: Props) {
  const router = useRouter();
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState(String(initial?.name || ""));
  const [bannerUrl, setBannerUrl] = useState(String(initial?.bannerUrl || ""));
  const [posterUrl, setPosterUrl] = useState(String(initial?.posterUrl || ""));
  const [startDate, setStartDate] = useState(
    toLocalInput(initial?.startDate as string),
  );
  const [endDate, setEndDate] = useState(
    toLocalInput(initial?.endDate as string),
  );
  const [registrationOpensAt, setRegistrationOpensAt] = useState(
    toLocalInput(initial?.registrationOpensAt as string),
  );
  const [registrationClosesAt, setRegistrationClosesAt] = useState(
    toLocalInput(initial?.registrationClosesAt as string),
  );

  const existingStart = initial?.startDate
    ? new Date(initial.startDate as string)
    : null;
  const allowPastStart = Boolean(
    mode === "edit" && existingStart && existingStart < new Date(),
  );

  const nowMin = useMemo(() => toDatetimeLocalMin(new Date()), []);
  const startMin = allowPastStart ? undefined : nowMin;
  const endMin = startDate || startMin;
  const opensMin = allowPastStart ? undefined : nowMin;
  const closesMin = registrationOpensAt || opensMin;
  const closesMax = startDate || undefined;

  const [categories, setCategories] = useState<CategoryDraft[]>(() => {
    const existing = initial?.categories as CategoryDraft[] | undefined;
    if (existing?.length) {
      return existing.map((c) => ({
        key: c.key,
        name: c.name,
        type: c.type,
        fee: Number(c.fee || 0),
        maxEntries: c.maxEntries ?? null,
      }));
    }
    return [
      {
        key: "mens-singles",
        name: "Men's Singles",
        type: "singles" as const,
        fee: 0,
        maxEntries: null,
      },
    ];
  });

  function validateClient(payload: {
    name: string;
    venueName: string;
    startDate: string;
    endDate: string;
    registrationOpensAt: string | null;
    registrationClosesAt: string | null;
    categories: CategoryDraft[];
  }): FieldErrors {
    const errors: FieldErrors = {};
    if (!payload.name.trim() || payload.name.trim().length < 2) {
      errors.name = "Tournament name is required (at least 2 characters).";
    }
    if (!payload.venueName.trim()) {
      errors.venueName = "Venue name is required.";
    }
    if (!payload.categories.length) {
      errors.categories = "Add at least one category.";
    } else {
      payload.categories.forEach((c, i) => {
        if (!c.name.trim()) {
          errors[`category_${i}`] = "Category name is required.";
        }
      });
    }

    const dateResult = validateTournamentDates({
      startDate: payload.startDate,
      endDate: payload.endDate,
      registrationOpensAt: payload.registrationOpensAt,
      registrationClosesAt: payload.registrationClosesAt,
      allowPastStart,
      allowPastRegistration: mode === "edit",
    });
    if (!dateResult.ok) {
      Object.assign(errors, dateResult.errors);
    }
    return errors;
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setFormError("");
    setFormSuccess("");
    setFieldErrors({});
    const form = new FormData(e.currentTarget);
    const payload = {
      name: name.trim(),
      slug: String(form.get("slug") || "") || undefined,
      description: String(form.get("description") || ""),
      bannerUrl: bannerUrl.trim(),
      posterUrl: posterUrl.trim(),
      organizerName: String(form.get("organizerName") || ""),
      startDate,
      endDate,
      reportingTime: String(form.get("reportingTime") || ""),
      venueName: String(form.get("venueName") || "").trim(),
      venueAddress: String(form.get("venueAddress") || ""),
      mapLink: String(form.get("mapLink") || ""),
      registrationOpensAt: registrationOpensAt || null,
      registrationClosesAt: registrationClosesAt || null,
      prizeDetails: String(form.get("prizeDetails") || ""),
      formatNotes: String(form.get("formatNotes") || ""),
      scoringRules: String(form.get("scoringRules") || ""),
      cancellationPolicy: String(form.get("cancellationPolicy") || ""),
      refundPolicy: String(form.get("refundPolicy") || ""),
      contactEmail: String(form.get("contactEmail") || ""),
      contactPhone: String(form.get("contactPhone") || ""),
      status: String(form.get("status") || "draft"),
      categories: categories.map((c) => ({
        ...c,
        maxEntries: c.maxEntries || null,
      })),
    };

    const clientErrors = validateClient(payload);
    if (Object.keys(clientErrors).length) {
      setFieldErrors(clientErrors);
      setFormError(
        Object.values(clientErrors)[0] ||
          "Please fix the highlighted fields before saving.",
      );
      setSaving(false);
      scrollFormAlertsIntoView();
      return;
    }

    const body = {
      ...payload,
      startDate: localInputToIso(payload.startDate),
      endDate: localInputToIso(payload.endDate),
      registrationOpensAt: payload.registrationOpensAt
        ? localInputToIso(payload.registrationOpensAt)
        : null,
      registrationClosesAt: payload.registrationClosesAt
        ? localInputToIso(payload.registrationClosesAt)
        : null,
    };

    const url =
      mode === "create"
        ? "/api/admin/tournaments"
        : `/api/admin/tournaments/${tournamentId}`;
    try {
      const res = await fetch(url, {
        method: mode === "create" ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      setSaving(false);
      if (!res.ok) {
        if (data.fieldErrors && typeof data.fieldErrors === "object") {
          setFieldErrors(data.fieldErrors as FieldErrors);
        }
        setFormError(
          data.error || "Could not save tournament. Please try again.",
        );
        scrollFormAlertsIntoView();
        return;
      }
      setFormSuccess(
        `Saved. Status is now "${String(data.tournament?.status || body.status).replaceAll("_", " ")}".`,
      );
      scrollFormAlertsIntoView();
      const id = data.tournament?._id || tournamentId;
      router.push(`/admin/tournaments/${id}`);
      router.refresh();
    } catch {
      setSaving(false);
      setFormError("Network error — could not reach the server. Try again.");
      scrollFormAlertsIntoView();
    }
  }

  function scrollFormAlertsIntoView() {
    const el = document.getElementById("tournament-form-actions");
    const scroller = el?.closest(".overflow-auto") as HTMLElement | null;
    if (scroller) {
      scroller.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  const inputClass =
    "w-full rounded-md border border-ink/15 bg-white px-3 py-2 text-sm outline-none focus:border-leaf";
  const errorInputClass =
    "w-full rounded-md border border-red-400 bg-white px-3 py-2 text-sm outline-none focus:border-red-500";

  function fieldClass(key: string) {
    return fieldErrors[key] ? errorInputClass : inputClass;
  }

  const previewSrc = posterUrl || bannerUrl;

  const saveButton = (
    <button
      type="submit"
      disabled={saving}
      className="rounded-md bg-ink px-5 py-2.5 text-sm font-semibold text-white hover:bg-ink-soft disabled:opacity-60"
    >
      {saving
        ? "Saving…"
        : mode === "create"
          ? "Create tournament"
          : "Save changes"}
    </button>
  );

  return (
    <form onSubmit={onSubmit} className="space-y-8 pb-8" noValidate>
      <div
        id="tournament-form-actions"
        className="sticky top-0 z-20 -mx-6 mb-2 space-y-3 border-b border-ink/10 bg-canvas/95 px-6 py-3 backdrop-blur"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="max-w-xl text-xs text-muted">
            To accept public registrations: set Status to{" "}
            <strong>registration open</strong>, fill registration open/close
            dates, then Save.
          </p>
          {saveButton}
        </div>
        {formError ? (
          <div
            role="alert"
            className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {formError}
          </div>
        ) : null}
        {formSuccess ? (
          <div
            role="status"
            className="rounded-md border border-leaf/30 bg-leaf-soft px-4 py-3 text-sm text-leaf"
          >
            {formSuccess}
          </div>
        ) : null}
      </div>

      <section className="grid gap-4 rounded-xl border border-ink/8 bg-white p-5 md:grid-cols-2">
        <h2 className="font-display text-lg md:col-span-2">Basics</h2>
        <label className="text-sm md:col-span-2">
          <span className="mb-1 block font-medium">
            Tournament name
            <RequiredMark />
          </span>
          <input
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={fieldClass("name")}
            aria-invalid={Boolean(fieldErrors.name)}
          />
          <FieldError message={fieldErrors.name} />
        </label>
        <label className="text-sm">
          <span className="mb-1 block font-medium">Slug</span>
          <input
            name="slug"
            defaultValue={String(initial?.slug || "")}
            placeholder="auto from name"
            className={inputClass}
          />
          <p className="mt-1 text-xs text-muted">
            Leave blank to generate from the tournament name.
          </p>
        </label>
        <label className="text-sm">
          <span className="mb-1 block font-medium">Status</span>
          <select
            name="status"
            defaultValue={String(initial?.status || "draft")}
            className={inputClass}
          >
            {TOURNAMENT_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.replaceAll("_", " ")}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm md:col-span-2">
          <span className="mb-1 block font-medium">Description</span>
          <textarea
            name="description"
            rows={3}
            defaultValue={String(initial?.description || "")}
            className={inputClass}
          />
        </label>
        <label className="text-sm">
          <span className="mb-1 block font-medium">Banner URL</span>
          <input
            name="bannerUrl"
            value={bannerUrl}
            onChange={(e) => setBannerUrl(e.target.value)}
            placeholder="https://… or /gallery/…"
            className={inputClass}
          />
        </label>
        <label className="text-sm">
          <span className="mb-1 block font-medium">Poster URL</span>
          <input
            name="posterUrl"
            value={posterUrl}
            onChange={(e) => setPosterUrl(e.target.value)}
            placeholder="Optional — initials used if empty"
            className={inputClass}
          />
        </label>
        <div className="md:col-span-2">
          <p className="mb-2 text-xs font-medium text-muted">Poster preview</p>
          <div className="relative h-36 w-full max-w-sm overflow-hidden rounded-lg ring-1 ring-ink/10">
            <TournamentPoster name={name || "ATPA Tournament"} src={previewSrc} />
          </div>
          {!previewSrc ? (
            <p className="mt-2 text-xs text-muted">
              No poster yet — initials from the first two words of the name will
              be shown publicly.
            </p>
          ) : null}
        </div>
      </section>

      <section className="grid gap-4 rounded-xl border border-ink/8 bg-white p-5 md:grid-cols-2">
        <h2 className="font-display text-lg md:col-span-2">Schedule & venue</h2>
        <p className="text-xs text-muted md:col-span-2">
          Past dates cannot be selected for new events. End must be on/after
          start. Registration must close on or before the start date.
        </p>
        <label className="text-sm">
          <span className="mb-1 block font-medium">
            Start
            <RequiredMark />
          </span>
          <input
            type="datetime-local"
            name="startDate"
            value={startDate}
            min={startMin}
            onChange={(e) => {
              const next = e.target.value;
              setStartDate(next);
              if (endDate && next && endDate < next) setEndDate(next);
              if (
                registrationClosesAt &&
                next &&
                registrationClosesAt > next
              ) {
                setRegistrationClosesAt(next);
              }
            }}
            className={fieldClass("startDate")}
            aria-invalid={Boolean(fieldErrors.startDate)}
          />
          <FieldError message={fieldErrors.startDate} />
        </label>
        <label className="text-sm">
          <span className="mb-1 block font-medium">
            End
            <RequiredMark />
          </span>
          <input
            type="datetime-local"
            name="endDate"
            value={endDate}
            min={endMin}
            onChange={(e) => setEndDate(e.target.value)}
            className={fieldClass("endDate")}
            aria-invalid={Boolean(fieldErrors.endDate)}
          />
          <FieldError message={fieldErrors.endDate} />
        </label>
        <label className="text-sm">
          <span className="mb-1 block font-medium">Registration opens</span>
          <input
            type="datetime-local"
            name="registrationOpensAt"
            value={registrationOpensAt}
            min={opensMin}
            max={startDate || undefined}
            onChange={(e) => {
              const next = e.target.value;
              setRegistrationOpensAt(next);
              if (
                registrationClosesAt &&
                next &&
                registrationClosesAt < next
              ) {
                setRegistrationClosesAt(next);
              }
            }}
            className={fieldClass("registrationOpensAt")}
            aria-invalid={Boolean(fieldErrors.registrationOpensAt)}
          />
          <FieldError message={fieldErrors.registrationOpensAt} />
        </label>
        <label className="text-sm">
          <span className="mb-1 block font-medium">Registration closes</span>
          <input
            type="datetime-local"
            name="registrationClosesAt"
            value={registrationClosesAt}
            min={closesMin}
            max={closesMax}
            onChange={(e) => setRegistrationClosesAt(e.target.value)}
            className={fieldClass("registrationClosesAt")}
            aria-invalid={Boolean(fieldErrors.registrationClosesAt)}
          />
          <FieldError message={fieldErrors.registrationClosesAt} />
        </label>
        <label className="text-sm">
          <span className="mb-1 block font-medium">Reporting time</span>
          <input
            name="reportingTime"
            defaultValue={String(initial?.reportingTime || "")}
            placeholder="e.g. 8:00 AM"
            className={inputClass}
          />
        </label>
        <label className="text-sm">
          <span className="mb-1 block font-medium">Organizer</span>
          <input
            name="organizerName"
            defaultValue={String(
              initial?.organizerName ||
                "Amateur Telangana Pickleball Association",
            )}
            className={inputClass}
          />
        </label>
        <label className="text-sm">
          <span className="mb-1 block font-medium">
            Venue name
            <RequiredMark />
          </span>
          <input
            name="venueName"
            defaultValue={String(initial?.venueName || "")}
            className={fieldClass("venueName")}
            aria-invalid={Boolean(fieldErrors.venueName)}
          />
          <FieldError message={fieldErrors.venueName} />
        </label>
        <label className="text-sm">
          <span className="mb-1 block font-medium">Map link</span>
          <input
            name="mapLink"
            defaultValue={String(initial?.mapLink || "")}
            className={inputClass}
          />
        </label>
        <label className="text-sm md:col-span-2">
          <span className="mb-1 block font-medium">Venue address</span>
          <input
            name="venueAddress"
            defaultValue={String(initial?.venueAddress || "")}
            className={inputClass}
          />
        </label>
        <label className="text-sm">
          <span className="mb-1 block font-medium">Contact email</span>
          <input
            name="contactEmail"
            type="email"
            defaultValue={String(initial?.contactEmail || "")}
            className={inputClass}
          />
        </label>
        <label className="text-sm">
          <span className="mb-1 block font-medium">Contact phone</span>
          <input
            name="contactPhone"
            defaultValue={String(initial?.contactPhone || "")}
            className={inputClass}
          />
        </label>
      </section>

      <section className="space-y-3 rounded-xl border border-ink/8 bg-white p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg">
            Categories
            <RequiredMark />
          </h2>
          <button
            type="button"
            onClick={() =>
              setCategories((prev) => [
                ...prev,
                {
                  key: `cat-${prev.length + 1}`,
                  name: "",
                  type: "singles",
                  fee: 0,
                  maxEntries: null,
                },
              ])
            }
            className="text-sm font-medium text-leaf hover:underline"
          >
            + Add category
          </button>
        </div>
        <FieldError message={fieldErrors.categories} />
        {categories.map((c, idx) => (
          <div
            key={idx}
            className="grid gap-3 rounded-lg border border-ink/8 p-3 md:grid-cols-5"
          >
            <div>
              <input
                value={c.name}
                onChange={(e) => {
                  const nextName = e.target.value;
                  setCategories((prev) =>
                    prev.map((row, i) =>
                      i === idx
                        ? {
                            ...row,
                            name: nextName,
                            key: nextName
                              .toLowerCase()
                              .replace(/[^a-z0-9]+/g, "-")
                              .replace(/^-|-$/g, ""),
                          }
                        : row,
                    ),
                  );
                }}
                className={
                  fieldErrors[`category_${idx}`] ? errorInputClass : inputClass
                }
                placeholder="Category name *"
              />
              <FieldError message={fieldErrors[`category_${idx}`]} />
            </div>
            <select
              value={c.type}
              onChange={(e) =>
                setCategories((prev) =>
                  prev.map((row, i) =>
                    i === idx
                      ? {
                          ...row,
                          type: e.target.value as CategoryDraft["type"],
                        }
                      : row,
                  ),
                )
              }
              className={inputClass}
            >
              {CATEGORY_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t.replaceAll("_", " ")}
                </option>
              ))}
            </select>
            <input
              type="number"
              min={0}
              value={c.fee}
              onChange={(e) =>
                setCategories((prev) =>
                  prev.map((row, i) =>
                    i === idx ? { ...row, fee: Number(e.target.value) } : row,
                  ),
                )
              }
              className={inputClass}
              placeholder="Fee (₹)"
            />
            <input
              type="number"
              min={1}
              value={c.maxEntries ?? ""}
              onChange={(e) =>
                setCategories((prev) =>
                  prev.map((row, i) =>
                    i === idx
                      ? {
                          ...row,
                          maxEntries: e.target.value
                            ? Number(e.target.value)
                            : null,
                        }
                      : row,
                  ),
                )
              }
              className={inputClass}
              placeholder="Max entries"
            />
            <button
              type="button"
              onClick={() =>
                setCategories((prev) => prev.filter((_, i) => i !== idx))
              }
              className="text-sm text-red-600 hover:underline"
            >
              Remove
            </button>
          </div>
        ))}
      </section>

      <section className="grid gap-4 rounded-xl border border-ink/8 bg-white p-5 md:grid-cols-2">
        <h2 className="font-display text-lg md:col-span-2">Policies</h2>
        <label className="text-sm md:col-span-2">
          <span className="mb-1 block font-medium">Prize details</span>
          <textarea
            name="prizeDetails"
            rows={2}
            defaultValue={String(initial?.prizeDetails || "")}
            className={inputClass}
          />
        </label>
        <label className="text-sm">
          <span className="mb-1 block font-medium">Format</span>
          <textarea
            name="formatNotes"
            rows={2}
            defaultValue={String(initial?.formatNotes || "")}
            className={inputClass}
          />
        </label>
        <label className="text-sm">
          <span className="mb-1 block font-medium">Scoring rules</span>
          <textarea
            name="scoringRules"
            rows={2}
            defaultValue={String(initial?.scoringRules || "")}
            className={inputClass}
          />
        </label>
        <label className="text-sm">
          <span className="mb-1 block font-medium">Cancellation policy</span>
          <textarea
            name="cancellationPolicy"
            rows={2}
            defaultValue={String(initial?.cancellationPolicy || "")}
            className={inputClass}
          />
        </label>
        <label className="text-sm">
          <span className="mb-1 block font-medium">Refund policy</span>
          <textarea
            name="refundPolicy"
            rows={2}
            defaultValue={String(initial?.refundPolicy || "")}
            className={inputClass}
          />
        </label>
      </section>

      <div className="flex justify-end border-t border-ink/10 pt-4">
        {saveButton}
      </div>
    </form>
  );
}
