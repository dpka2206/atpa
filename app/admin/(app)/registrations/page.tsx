import { RegistrationsPanel } from "@/components/admin/RegistrationsPanel";

export default function AdminRegistrationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl">Registrations</h1>
        <p className="mt-1 text-sm text-muted">
          All tournament registrations across the association
        </p>
      </div>
      <RegistrationsPanel />
    </div>
  );
}
