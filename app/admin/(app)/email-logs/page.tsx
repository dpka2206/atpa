import { EmailLogsPanel } from "@/components/admin/EmailLogsPanel";

export default function EmailLogsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl">Email logs</h1>
        <p className="mt-1 text-sm text-muted">
          Delivery status and resend for transactional emails
        </p>
      </div>
      <EmailLogsPanel />
    </div>
  );
}
