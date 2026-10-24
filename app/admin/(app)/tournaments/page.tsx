import Link from "next/link";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { requireAdminSession } from "@/lib/admin-auth";
import { connectDb } from "@/lib/db";
import { Tournament } from "@/lib/models";
import { TournamentBulkImport } from "@/components/admin/TournamentBulkImport";
import { TournamentPoster } from "@/components/ui/TournamentPoster";

export default async function AdminTournamentsPage() {
  await connection();
  const gate = await requireAdminSession();
  if (gate.error) redirect("/admin/login");

  await connectDb();
  const tournaments = await Tournament.find().sort({ startDate: -1 }).lean();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl">Tournaments</h1>
          <p className="mt-1 text-sm text-muted">
            Create, publish and manage events
          </p>
        </div>
        <Link
          href="/admin/tournaments/new"
          className="rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white hover:bg-ink-soft"
        >
          Create tournament
        </Link>
      </div>

      <TournamentBulkImport />

      <div className="overflow-hidden rounded-xl border border-ink/8 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-ink/8 bg-canvas/60 text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Event</th>
              <th className="px-4 py-3 font-medium">Dates</th>
              <th className="px-4 py-3 font-medium">Venue</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/8">
            {tournaments.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted">
                  No tournaments yet. Create your first event or import a CSV.
                </td>
              </tr>
            ) : (
              tournaments.map((t) => (
                <tr key={String(t._id)} className="hover:bg-canvas/40">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md">
                        <TournamentPoster
                          name={t.name}
                          src={t.posterUrl || t.bannerUrl}
                          sizes="40px"
                        />
                      </div>
                      <span className="font-medium">{t.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {format(new Date(t.startDate), "d MMM yyyy")}
                  </td>
                  <td className="px-4 py-3 text-muted">{t.venueName}</td>
                  <td className="px-4 py-3">
                    <span className="rounded bg-leaf-soft px-2 py-0.5 text-xs font-medium text-leaf">
                      {t.status.replaceAll("_", " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/tournaments/${t._id}`}
                      className="font-medium text-leaf hover:underline"
                    >
                      Open
                    </Link>
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
