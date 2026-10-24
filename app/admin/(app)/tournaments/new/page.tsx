import Link from "next/link";
import { TournamentForm } from "@/components/admin/TournamentForm";

export default function NewTournamentPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <Link
          href="/admin/tournaments"
          className="text-sm text-muted hover:text-ink"
        >
          ← All tournaments
        </Link>
        <h1 className="mt-2 font-display text-3xl">Create tournament</h1>
      </div>
      <TournamentForm mode="create" />
    </div>
  );
}
