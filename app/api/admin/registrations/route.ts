import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin-auth";
import { connectDb } from "@/lib/db";
import { Registration } from "@/lib/models";
import {
  PAYMENT_STATUSES,
  REGISTRATION_STATUSES,
} from "@/lib/constants";

export async function GET(request: Request) {
  const gate = await requireAdminSession();
  if (gate.error) return gate.error;

  const { searchParams } = new URL(request.url);
  const tournamentId = searchParams.get("tournamentId");
  const q = searchParams.get("q")?.trim();
  const registrationStatus = searchParams.get("registrationStatus");
  const paymentStatus = searchParams.get("paymentStatus");
  const categoryKey = searchParams.get("categoryKey");
  const format = searchParams.get("format");

  await connectDb();

  const filter: Record<string, unknown> = {};
  if (tournamentId) filter.tournamentId = tournamentId;
  if (
    registrationStatus &&
    (REGISTRATION_STATUSES as readonly string[]).includes(registrationStatus)
  ) {
    filter.registrationStatus = registrationStatus;
  }
  if (
    paymentStatus &&
    (PAYMENT_STATUSES as readonly string[]).includes(paymentStatus)
  ) {
    filter.paymentStatus = paymentStatus;
  }
  if (categoryKey) filter.categoryKey = categoryKey;

  if (q) {
    filter.$or = [
      { registrationId: new RegExp(q, "i") },
      { "playerSnapshot.fullName": new RegExp(q, "i") },
      { "playerSnapshot.email": new RegExp(q, "i") },
      { "playerSnapshot.phone": new RegExp(q, "i") },
    ];
  }

  const registrations = await Registration.find(filter)
    .sort({ createdAt: -1 })
    .limit(500)
    .lean();

  if (format === "csv") {
    const header = [
      "registrationId",
      "fullName",
      "email",
      "phone",
      "category",
      "partnerName",
      "registrationStatus",
      "paymentStatus",
      "feeAmount",
      "createdAt",
    ];
    const rows = registrations.map((r) =>
      [
        r.registrationId,
        r.playerSnapshot?.fullName || "",
        r.playerSnapshot?.email || "",
        r.playerSnapshot?.phone || "",
        r.categoryName,
        r.partnerName || "",
        r.registrationStatus,
        r.paymentStatus,
        r.feeAmount,
        r.createdAt ? new Date(r.createdAt).toISOString() : "",
      ]
        .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
        .join(","),
    );
    const csv = [header.join(","), ...rows].join("\n");
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="registrations.csv"`,
      },
    });
  }

  return NextResponse.json({ registrations });
}
