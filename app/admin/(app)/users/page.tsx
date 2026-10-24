import { UsersPanel } from "@/components/admin/UsersPanel";

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl">Users & roles</h1>
        <p className="mt-1 text-sm text-muted">
          Super Admin only — manage admin accounts
        </p>
      </div>
      <UsersPanel />
    </div>
  );
}
