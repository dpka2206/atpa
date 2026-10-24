import Link from "next/link";
import { connection } from "next/server";
import { requireAdminSession } from "@/lib/admin-auth";
import { connectDb } from "@/lib/db";
import { Player, Registration, Tournament } from "@/lib/models";
import {
  ACTIVE_TOURNAMENT_STATUSES,
  PUBLIC_TOURNAMENT_STATUSES,
} from "@/lib/constants";
import { format } from "date-fns";
import { redirect } from "next/navigation";

export default async function AdminDashboardPage() {
  await connection();
  const gate = await requireAdminSession();
  if (gate.error) redirect("/admin/login");

  await connectDb();

  const [
    totalPlayers,
    activeTournaments,
    totalRegistrations,
    paymentPending,
    awaitingReview,
    upcoming,
    recentRegistrations,
  ] = await Promise.all([
    Player.countDocuments(),
    Tournament.countDocuments({
      status: { $in: ACTIVE_TOURNAMENT_STATUSES },
    }),
    Registration.countDocuments(),
    Registration.countDocuments({ paymentStatus: "pending" }),
    Registration.countDocuments({ registrationStatus: "awaiting_review" }),
    Tournament.find({
      status: {
        $in: PUBLIC_TOURNAMENT_STATUSES.filter((s) => s !== "completed"),
      },
      endDate: { $gte: new Date() },
    })
      .sort({ startDate: 1 })
      .limit(5)
      .lean(),
    Registration.find()
      .sort({ createdAt: -1 })
      .limit(8)
      .lean(),
  ]);

  const stats = [
    { label: "Total players", value: totalPlayers },
    { label: "Active tournaments", value: activeTournaments },
    { label: "Registrations", value: totalRegistrations },
    { label: "Awaiting review", value: awaitingReview },
    { label: "Payments pending", value: paymentPending },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-ink">Dashboard</h1>
          <p className="mt-1 text-sm text-muted">
            Live association and tournament activity
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/tournaments/new"
            className="rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white hover:bg-ink-soft"
          >
            Create tournament
          </Link>
          <Link
            href="/admin/registrations"
            className="rounded-md border border-ink/15 bg-white px-4 py-2 text-sm font-medium hover:bg-canvas"
          >
            View registrations
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-ink/8 bg-white p-4"
          >
            <p className="text-xs font-medium uppercase tracking-wide text-muted">
              {s.label}
            </p>
            <p className="mt-2 font-display text-3xl text-ink">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-ink/8 bg-white p-5">
          <h2 className="font-display text-xl">Upcoming tournaments</h2>
          <ul className="mt-4 divide-y divide-ink/8">
            {upcoming.length === 0 ? (
              <li className="py-4 text-sm text-muted">No upcoming events.</li>
            ) : (
              upcoming.map((t) => (
                <li key={String(t._id)} className="flex items-start justify-between gap-3 py-3">
                  <div>
                    <Link
                      href={`/admin/tournaments/${t._id}`}
                      className="font-medium text-ink hover:text-leaf"
                    >
                      {t.name}
                    </Link>
                    <p className="text-xs text-muted">
                      {format(new Date(t.startDate), "d MMM yyyy")} · {t.venueName}
                    </p>
                  </div>
                  <span className="rounded bg-leaf-soft px-2 py-0.5 text-xs font-medium text-leaf">
                    {t.status.replaceAll("_", " ")}
                  </span>
                </li>
              ))
            )}
          </ul>
        </section>

        <section className="rounded-xl border border-ink/8 bg-white p-5">
          <h2 className="font-display text-xl">Recent registrations</h2>
          <ul className="mt-4 divide-y divide-ink/8">
            {recentRegistrations.length === 0 ? (
              <li className="py-4 text-sm text-muted">No registrations yet.</li>
            ) : (
              recentRegistrations.map((r) => (
                <li key={String(r._id)} className="py-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-ink">
                        {r.playerSnapshot?.fullName}
                      </p>
                      <p className="text-xs text-muted">
                        {r.registrationId} · {r.categoryName}
                      </p>
                    </div>
                    <span className="text-xs text-muted">
                      {r.registrationStatus.replaceAll("_", " ")}
                    </span>
                  </div>
                </li>
              ))
            )}
          </ul>
        </section>
      </div>
    </div>
  );
}
