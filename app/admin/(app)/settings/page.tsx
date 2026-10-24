export default function AdminSettingsPage() {
  return (
    <div className="space-y-4">
      <h1 className="font-display text-3xl">Settings</h1>
      <div className="rounded-xl border border-ink/8 bg-white p-5 text-sm text-muted">
        <p>
          Phase 1 uses environment variables for MongoDB, Auth, and Gmail SMTP.
          Payment gateway settings will land in a later phase.
        </p>
        <ul className="mt-4 list-disc space-y-1 pl-5">
          <li>Database: MongoDB Atlas (`MONGODB_URI`)</li>
          <li>Email: Gmail SMTP (`SMTP_USER` / `SMTP_PASS`)</li>
          <li>Admin notify: `ADMIN_NOTIFY_EMAIL`</li>
        </ul>
      </div>
    </div>
  );
}
