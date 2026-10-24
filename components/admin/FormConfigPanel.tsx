"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type FieldConfig = { enabled: boolean; required: boolean };

const FIELD_LABELS: Record<string, string> = {
  fullName: "Full name",
  email: "Email",
  phone: "Mobile number",
  dateOfBirth: "Date of birth",
  gender: "Gender / division",
  city: "City",
  district: "District",
  emergencyContact: "Emergency contact",
  skillLevel: "Skill level",
  partnerName: "Partner name",
  membershipId: "Membership ID",
  rulesConsent: "Rules agreement",
  privacyConsent: "Privacy consent",
  photoConsent: "Photo/video consent",
};

type Props = {
  tournamentId: string;
  initialFields: Record<string, FieldConfig>;
  successMessage: string;
  emailSubjectTemplate: string;
};

export function FormConfigPanel({
  tournamentId,
  initialFields,
  successMessage: initialSuccess,
  emailSubjectTemplate: initialSubject,
}: Props) {
  const router = useRouter();
  const [fields, setFields] = useState(initialFields);
  const [successMessage, setSuccessMessage] = useState(initialSuccess);
  const [emailSubjectTemplate, setEmailSubjectTemplate] =
    useState(initialSubject);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function save() {
    setSaving(true);
    setMessage("");
    const res = await fetch(`/api/admin/tournaments/${tournamentId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        formConfig: {
          fields,
          successMessage,
          emailSubjectTemplate,
        },
      }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) {
      setMessage(data.error || "Save failed");
      return;
    }
    setMessage("Form settings saved");
    router.refresh();
  }

  return (
    <div className="space-y-6 rounded-xl border border-ink/8 bg-white p-5">
      <div>
        <h2 className="font-display text-xl">Registration form fields</h2>
        <p className="mt-1 text-sm text-muted">
          Enable or require fields for this tournament only.
        </p>
      </div>

      <div className="divide-y divide-ink/8 rounded-lg border border-ink/8">
        {Object.entries(fields).map(([key, config]) => (
          <div
            key={key}
            className="flex flex-wrap items-center justify-between gap-3 px-3 py-3 text-sm"
          >
            <span className="font-medium">
              {FIELD_LABELS[key] || key}
            </span>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={config.enabled}
                  disabled={key === "fullName" || key === "email" || key === "phone"}
                  onChange={(e) =>
                    setFields((prev) => ({
                      ...prev,
                      [key]: { ...prev[key], enabled: e.target.checked },
                    }))
                  }
                />
                Enabled
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={config.required}
                  disabled={!config.enabled}
                  onChange={(e) =>
                    setFields((prev) => ({
                      ...prev,
                      [key]: { ...prev[key], required: e.target.checked },
                    }))
                  }
                />
                Required
              </label>
            </div>
          </div>
        ))}
      </div>

      <label className="block text-sm">
        <span className="mb-1 block font-medium">Success message</span>
        <textarea
          value={successMessage}
          onChange={(e) => setSuccessMessage(e.target.value)}
          rows={3}
          className="w-full rounded-md border border-ink/15 px-3 py-2"
        />
      </label>

      <label className="block text-sm">
        <span className="mb-1 block font-medium">
          Confirmation email subject (use {"{{tournamentName}}"})
        </span>
        <input
          value={emailSubjectTemplate}
          onChange={(e) => setEmailSubjectTemplate(e.target.value)}
          className="w-full rounded-md border border-ink/15 px-3 py-2"
        />
      </label>

      {message ? <p className="text-sm text-leaf">{message}</p> : null}

      <button
        type="button"
        disabled={saving}
        onClick={() => void save()}
        className="rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
      >
        {saving ? "Saving…" : "Save form settings"}
      </button>
    </div>
  );
}
