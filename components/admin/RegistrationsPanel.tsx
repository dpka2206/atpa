"use client";

import { useCallback, useEffect, useState } from "react";
import {
  PAYMENT_STATUSES,
  REGISTRATION_STATUSES,
} from "@/lib/constants";

type Registration = {
  _id: string;
  registrationId: string;
  categoryName: string;
  categoryKey: string;
  partnerName?: string;
  registrationStatus: string;
  paymentStatus: string;
  feeAmount: number;
  internalNotes?: string;
  playerSnapshot?: {
    fullName?: string;
    email?: string;
    phone?: string;
    city?: string;
  };
  createdAt: string;
};

type Props = {
  tournamentId?: string;
};

function normalizeRegistration(raw: Registration): Registration {
  return {
    ...raw,
    _id: String(raw._id),
  };
}

export function RegistrationsPanel({ tournamentId }: Props) {
  const [rows, setRows] = useState<Registration[]>([]);
  const [q, setQ] = useState("");
  const [registrationStatus, setRegistrationStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [selected, setSelected] = useState<Registration | null>(null);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (tournamentId) params.set("tournamentId", tournamentId);
    if (q) params.set("q", q);
    if (registrationStatus) params.set("registrationStatus", registrationStatus);
    if (paymentStatus) params.set("paymentStatus", paymentStatus);
    const res = await fetch(`/api/admin/registrations?${params}`);
    const data = await res.json();
    const list = (data.registrations || []).map(normalizeRegistration);
    setRows(list);
    setSelected((prev) => {
      if (!prev) return null;
      const match = list.find((r: Registration) => r._id === String(prev._id));
      return match || prev;
    });
    setLoading(false);
  }, [tournamentId, q, registrationStatus, paymentStatus]);

  useEffect(() => {
    void load();
  }, [load]);

  async function updateRegistration(
    id: string,
    body: Record<string, unknown>,
  ) {
    setActing(true);
    setMessage("");
    setError("");
    try {
      const res = await fetch(`/api/admin/registrations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Update failed");
        return;
      }
      const updated = normalizeRegistration(data.registration);
      setSelected(updated);
      setNotes(updated.internalNotes || "");
      setMessage(
        data.warning ||
          `Updated — ${updated.registrationStatus.replaceAll("_", " ")}, pay: ${updated.paymentStatus.replaceAll("_", " ")}`,
      );
      await load();
    } catch {
      setError("Network error — could not reach the server.");
    } finally {
      setActing(false);
    }
  }

  function exportCsv() {
    const params = new URLSearchParams();
    if (tournamentId) params.set("tournamentId", tournamentId);
    if (q) params.set("q", q);
    if (registrationStatus) params.set("registrationStatus", registrationStatus);
    if (paymentStatus) params.set("paymentStatus", paymentStatus);
    params.set("format", "csv");
    window.location.href = `/api/admin/registrations?${params}`;
  }

  const alreadyApproved =
    selected?.registrationStatus === "confirmed" &&
    (selected.paymentStatus === "paid" ||
      selected.paymentStatus === "not_applicable");

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search name, email, phone, ID"
          className="min-w-[220px] flex-1 rounded-md border border-ink/15 px-3 py-2 text-sm"
        />
        <select
          value={registrationStatus}
          onChange={(e) => setRegistrationStatus(e.target.value)}
          className="rounded-md border border-ink/15 px-3 py-2 text-sm"
        >
          <option value="">All registration statuses</option>
          {REGISTRATION_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.replaceAll("_", " ")}
            </option>
          ))}
        </select>
        <select
          value={paymentStatus}
          onChange={(e) => setPaymentStatus(e.target.value)}
          className="rounded-md border border-ink/15 px-3 py-2 text-sm"
        >
          <option value="">All payment statuses</option>
          {PAYMENT_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.replaceAll("_", " ")}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => void load()}
          className="rounded-md border border-ink/15 bg-white px-3 py-2 text-sm font-medium"
        >
          Refresh
        </button>
        <button
          type="button"
          onClick={exportCsv}
          className="rounded-md bg-ink px-3 py-2 text-sm font-semibold text-white"
        >
          Export CSV
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="overflow-hidden rounded-xl border border-ink/8 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-ink/8 bg-canvas/50 text-xs uppercase text-muted">
              <tr>
                <th className="px-3 py-2">Player</th>
                <th className="px-3 py-2">Category</th>
                <th className="px-3 py-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/8">
              {loading ? (
                <tr>
                  <td colSpan={3} className="px-3 py-6 text-muted">
                    Loading…
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-3 py-6 text-muted">
                    No registrations found.
                  </td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr
                    key={r._id}
                    className={`cursor-pointer hover:bg-canvas/40 ${
                      selected?._id === r._id ? "bg-leaf-soft/40" : ""
                    }`}
                    onClick={() => {
                      setSelected(r);
                      setNotes(r.internalNotes || "");
                      setMessage("");
                      setError("");
                    }}
                  >
                    <td className="px-3 py-2">
                      <p className="font-medium">
                        {r.playerSnapshot?.fullName}
                      </p>
                      <p className="text-xs text-muted">{r.registrationId}</p>
                    </td>
                    <td className="px-3 py-2 text-muted">{r.categoryName}</td>
                    <td className="px-3 py-2 text-xs">
                      {r.registrationStatus.replaceAll("_", " ")}
                      <br />
                      <span className="text-muted">
                        pay: {r.paymentStatus.replaceAll("_", " ")}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="rounded-xl border border-ink/8 bg-white p-4">
          {!selected ? (
            <p className="text-sm text-muted">
              Select a registration to review details.
            </p>
          ) : (
            <div className="space-y-3 text-sm">
              <h3 className="font-display text-lg">
                {selected.playerSnapshot?.fullName}
              </h3>
              <p className="text-muted">{selected.registrationId}</p>
              <p className="rounded-md bg-canvas px-3 py-2 text-xs">
                <span className="font-medium">
                  {selected.registrationStatus.replaceAll("_", " ")}
                </span>
                <span className="text-muted">
                  {" "}
                  · pay: {selected.paymentStatus.replaceAll("_", " ")}
                  {selected.feeAmount > 0
                    ? ` · fee ₹${selected.feeAmount}`
                    : ""}
                </span>
              </p>
              <dl className="space-y-1">
                <div>
                  <dt className="text-xs text-muted">Email</dt>
                  <dd>{selected.playerSnapshot?.email}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted">Phone</dt>
                  <dd>{selected.playerSnapshot?.phone}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted">Category</dt>
                  <dd>{selected.categoryName}</dd>
                </div>
                {selected.partnerName ? (
                  <div>
                    <dt className="text-xs text-muted">Partner</dt>
                    <dd>{selected.partnerName}</dd>
                  </div>
                ) : null}
              </dl>

              <label className="block">
                <span className="mb-1 block text-xs text-muted">
                  Internal notes
                </span>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full rounded-md border border-ink/15 px-2 py-1.5"
                />
              </label>

              {error ? (
                <p role="alert" className="text-sm font-medium text-red-600">
                  {error}
                </p>
              ) : null}
              {message ? (
                <p role="status" className="text-sm font-medium text-leaf">
                  {message}
                </p>
              ) : null}

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={acting || alreadyApproved}
                  onClick={() =>
                    void updateRegistration(selected._id, {
                      registrationStatus: "confirmed",
                      paymentStatus:
                        selected.feeAmount > 0 ? "paid" : "not_applicable",
                      internalNotes: notes,
                    })
                  }
                  className="rounded-md bg-leaf px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-60"
                >
                  {acting
                    ? "Working…"
                    : alreadyApproved
                      ? "Approved"
                      : "Approve"}
                </button>
                <button
                  type="button"
                  disabled={acting}
                  onClick={() =>
                    void updateRegistration(selected._id, {
                      registrationStatus: "rejected",
                      internalNotes: notes,
                      rejectionReason: "Rejected by admin",
                    })
                  }
                  className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-60"
                >
                  Reject
                </button>
                <button
                  type="button"
                  disabled={acting}
                  onClick={() =>
                    void updateRegistration(selected._id, {
                      registrationStatus: "waitlisted",
                      internalNotes: notes,
                    })
                  }
                  className="rounded-md border border-ink/15 px-3 py-1.5 text-xs font-medium disabled:opacity-60"
                >
                  Waitlist
                </button>
                <button
                  type="button"
                  disabled={acting}
                  onClick={() =>
                    void updateRegistration(selected._id, {
                      internalNotes: notes,
                    })
                  }
                  className="rounded-md border border-ink/15 px-3 py-1.5 text-xs font-medium disabled:opacity-60"
                >
                  Save notes
                </button>
                <button
                  type="button"
                  disabled={acting}
                  onClick={() =>
                    void updateRegistration(selected._id, { resendEmail: true })
                  }
                  className="rounded-md border border-ink/15 px-3 py-1.5 text-xs font-medium disabled:opacity-60"
                >
                  Resend email
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
