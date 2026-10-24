import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin-auth";
import { connectDb } from "@/lib/db";
import { AuditLog, Tournament } from "@/lib/models";
import { makeTournamentCode, slugify } from "@/lib/slug";
import {
  normalizeBulkRow,
  parseTournamentCsv,
} from "@/lib/tournaments/bulk-import";

export async function POST(request: Request) {
  const gate = await requireAdminSession({ write: true });
  if (gate.error) return gate.error;

  try {
    const contentType = request.headers.get("content-type") || "";
    let csvText = "";

    if (contentType.includes("multipart/form-data")) {
      const form = await request.formData();
      const file = form.get("file");
      if (!(file instanceof File)) {
        return NextResponse.json(
          { error: "Upload a CSV file in the file field." },
          { status: 400 },
        );
      }
      csvText = await file.text();
    } else {
      const body = await request.json();
      csvText = String(body.csv || body.text || "");
    }

    if (!csvText.trim()) {
      return NextResponse.json(
        { error: "CSV content is empty." },
        { status: 400 },
      );
    }

    const parsed = parseTournamentCsv(csvText);
    if (parsed.errors.length && !parsed.rows.length) {
      return NextResponse.json(
        { error: parsed.errors[0], errors: parsed.errors },
        { status: 400 },
      );
    }

    await connectDb();

    const created: Array<{ id: string; name: string; slug: string }> = [];
    const errors: string[] = [...parsed.errors];

    for (let i = 0; i < parsed.rows.length; i++) {
      const rowNumber = i + 2; // header is row 1
      const normalized = normalizeBulkRow(parsed.rows[i], rowNumber);
      if (!normalized.ok) {
        errors.push(normalized.error);
        continue;
      }

      const data = normalized.data;
      let slug = slugify(data.slug || data.name);
      const clash = await Tournament.findOne({ slug });
      if (clash) {
        slug = `${slug}-${Math.random().toString(36).slice(2, 5)}`;
      }

      try {
        const tournament = await Tournament.create({
          ...data,
          slug,
          tournamentCode: makeTournamentCode(data.name),
          startDate: new Date(data.startDate),
          endDate: new Date(data.endDate),
          registrationOpensAt: data.registrationOpensAt
            ? new Date(data.registrationOpensAt)
            : undefined,
          registrationClosesAt: data.registrationClosesAt
            ? new Date(data.registrationClosesAt)
            : undefined,
        });

        created.push({
          id: String(tournament._id),
          name: tournament.name,
          slug: tournament.slug,
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : "Create failed";
        errors.push(`Row ${rowNumber}: ${message}`);
      }
    }

    if (created.length) {
      await AuditLog.create({
        actorUserId: gate.session!.user.id,
        actorEmail: gate.session!.user.email,
        action: "tournament.bulk_import",
        entityType: "tournament",
        entityId: created.map((c) => c.id).join(","),
        details: { created: created.length, errors: errors.length },
      });
    }

    return NextResponse.json({
      created,
      createdCount: created.length,
      errors,
      errorCount: errors.length,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Bulk import failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
