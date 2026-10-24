import { connection } from "next/server";
import { notFound, redirect } from "next/navigation";
import { requireAdminSession } from "@/lib/admin-auth";
import { connectDb } from "@/lib/db";
import { Tournament } from "@/lib/models";
import { TournamentWorkspace } from "@/components/admin/TournamentWorkspace";

type Props = { params: Promise<{ id: string }> };

export default async function AdminTournamentDetailPage({ params }: Props) {
  await connection();
  const gate = await requireAdminSession();
  if (gate.error) redirect("/admin/login");

  const { id } = await params;
  await connectDb();
  const tournament = await Tournament.findById(id).lean();
  if (!tournament) notFound();

  const serialized = JSON.parse(JSON.stringify(tournament));

  return <TournamentWorkspace tournament={serialized} />;
}
