"use client";

import { useCallback, useEffect, useState } from "react";

type EmailLog = {
  _id: string;
  to: string;
  subject: string;
  template: string;
  status: string;
  error?: string;
  registrationId?: string;
  attempts: number;
  createdAt: string;
};

export function EmailLogsPanel() {
  const [logs, setLogs] = useState<EmailLog[]>([]);
  const [status, setStatus] = useState("");
  const [queuedCount, setQueuedCount] = useState(0);
  const [failedCount, setFailedCount] = useState(0);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    const res = await fetch(`/api/admin/email-logs?${params}`);
    const data = await res.json();
    setLogs(data.logs || []);
    setQueuedCount(data.queuedCount || 0);
    setFailedCount(data.failedCount || 0);
  }, [status]);

  useEffect(() => {
    void load();
  }, [load]);

  async function resend(logId: string) {
    setMessage("");
    setBusy(true);
    const res = await fetch("/api/admin/email-logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ logId }),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok || data.ok === false) {
      setMessage(data.error || "Resend failed");
    } else {
      setMessage("Email resent");
    }
    await load();
  }

  async function processQueue(includeFailed = false) {
    setMessage("");
    setBusy(true);
    const res = await fetch("/api/admin/email-logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "process_queue",
        includeFailed,
        limit: 40,
      }),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) {
      setMessage(data.error || "Queue processing failed");
    } else {
      setMessage(
        `Processed ${data.processed || 0}: ${data.sent || 0} sent, ${data.failed || 0} failed`,
      );
    }
    await load();
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-md border border-ink/15 px-3 py-2 text-sm"
        >
          <option value="">All statuses</option>
          <option value="sent">Sent</option>
          <option value="failed">Failed</option>
          <option value="queued">Queued</option>
        </select>
        <button
          type="button"
          onClick={() => void load()}
          className="rounded-md border border-ink/15 px-3 py-2 text-sm"
          disabled={busy}
        >
          Refresh
        </button>
        <button
          type="button"
          onClick={() => void processQueue(false)}
          className="rounded-md bg-ink px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
          disabled={busy}
        >
          Process queue ({queuedCount})
        </button>
        <button
          type="button"
          onClick={() => void processQueue(true)}
          className="rounded-md border border-ink/15 px-3 py-2 text-sm disabled:opacity-60"
          disabled={busy}
        >
          Retry failed ({failedCount})
        </button>
      </div>
      <p className="text-xs text-muted">
        Registration responses return immediately. Confirmation emails are
        queued and sent in the background so bursts of form submits stay fast.
      </p>
      {message ? <p className="text-sm text-leaf">{message}</p> : null}
      <div className="overflow-hidden rounded-xl border border-ink/8 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-ink/8 bg-canvas/50 text-xs uppercase text-muted">
            <tr>
              <th className="px-3 py-2">To</th>
              <th className="px-3 py-2">Subject</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2" />
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/8">
            {logs.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-3 py-6 text-muted">
                  No email logs yet.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log._id}>
                  <td className="px-3 py-2">
                    <p>{log.to}</p>
                    <p className="text-xs text-muted">{log.template}</p>
                  </td>
                  <td className="px-3 py-2">
                    {log.subject}
                    {log.error ? (
                      <p className="text-xs text-red-600">{log.error}</p>
                    ) : null}
                  </td>
                  <td className="px-3 py-2">
                    {log.status}
                    <span className="block text-xs text-muted">
                      attempts: {log.attempts || 0}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-right">
                    <button
                      type="button"
                      onClick={() => void resend(log._id)}
                      className="text-xs font-medium text-leaf hover:underline"
                      disabled={busy}
                    >
                      Resend
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}