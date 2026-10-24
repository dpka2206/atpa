"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { buildBulkTemplateCsv } from "@/lib/tournaments/bulk-import";

export function TournamentBulkImport() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<string[]>([]);

  function downloadTemplate() {
    const csv = buildBulkTemplateCsv();
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "atpa-tournaments-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  async function onFile(file: File) {
    setBusy(true);
    setMessage("");
    setErrors([]);
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/admin/tournaments/bulk", {
      method: "POST",
      body: form,
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok && !data.createdCount) {
      setMessage(data.error || "Import failed");
      setErrors(data.errors || []);
      return;
    }
    setMessage(
      `Imported ${data.createdCount || 0} tournament(s)${
        data.errorCount ? ` · ${data.errorCount} row(s) skipped` : ""
      }.`,
    );
    setErrors(data.errors || []);
    router.refresh();
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="rounded-md border border-ink/15 bg-white px-4 py-2 text-sm font-medium hover:bg-canvas"
        >
          {open ? "Hide bulk import" : "Bulk import CSV"}
        </button>
        <button
          type="button"
          onClick={downloadTemplate}
          className="rounded-md border border-ink/15 bg-white px-4 py-2 text-sm font-medium hover:bg-canvas"
        >
          Download template
        </button>
      </div>

      {open ? (
        <div className="rounded-xl border border-ink/8 bg-white p-5 text-sm">
          <h2 className="font-display text-lg">Bulk sheet import</h2>
          <p className="mt-2 text-muted">
            Upload a CSV with tournament rows. Required columns:{" "}
            <code className="text-xs">name</code>,{" "}
            <code className="text-xs">startDate</code>,{" "}
            <code className="text-xs">endDate</code>,{" "}
            <code className="text-xs">venueName</code>. Categories use{" "}
            <code className="text-xs">
              Name:type:fee:max|Name2:type:fee
            </code>{" "}
            (types: singles, doubles, mixed_doubles). Dates:{" "}
            <code className="text-xs">YYYY-MM-DDTHH:mm</code>. Past start dates
            are rejected. Empty poster/banner uses initials on the public site.
          </p>
          <input
            ref={inputRef}
            type="file"
            accept=".csv,text/csv"
            className="mt-4 block w-full text-sm"
            disabled={busy}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void onFile(file);
              e.target.value = "";
            }}
          />
          {busy ? (
            <p className="mt-3 text-muted">Importing…</p>
          ) : null}
          {message ? (
            <p className="mt-3 font-medium text-leaf">{message}</p>
          ) : null}
          {errors.length ? (
            <ul className="mt-3 max-h-40 list-disc space-y-1 overflow-auto pl-5 text-xs text-red-600">
              {errors.map((err) => (
                <li key={err}>{err}</li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
