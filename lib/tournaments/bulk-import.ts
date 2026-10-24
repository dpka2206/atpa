import { z } from "zod";
import { CATEGORY_TYPES, TOURNAMENT_STATUSES } from "@/lib/constants";
import { validateTournamentDates } from "@/lib/tournaments/validation";
import { slugify } from "@/lib/slug";

export const BULK_CSV_HEADERS = [
  "name",
  "slug",
  "description",
  "startDate",
  "endDate",
  "venueName",
  "venueAddress",
  "mapLink",
  "registrationOpensAt",
  "registrationClosesAt",
  "reportingTime",
  "organizerName",
  "contactEmail",
  "contactPhone",
  "status",
  "bannerUrl",
  "posterUrl",
  "prizeDetails",
  "formatNotes",
  "scoringRules",
  "cancellationPolicy",
  "refundPolicy",
  "categories",
] as const;

/**
 * categories cell format:
 * Name:type:fee:maxEntries|Name2:type:fee
 * type = singles | doubles | mixed_doubles
 * fee/maxEntries optional
 */
function parseCategories(raw: string) {
  if (!raw.trim()) {
    return [
      {
        key: "open",
        name: "Open",
        type: "singles" as const,
        fee: 0,
        currency: "INR",
      },
    ];
  }
  return raw
    .split("|")
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const [name, typeRaw, feeRaw, maxRaw] = part.split(":").map((s) => s.trim());
      const type = (CATEGORY_TYPES as readonly string[]).includes(typeRaw)
        ? (typeRaw as (typeof CATEGORY_TYPES)[number])
        : "singles";
      const fee = feeRaw ? Number(feeRaw) : 0;
      const maxEntries = maxRaw ? Number(maxRaw) : null;
      return {
        key: slugify(name || "category") || "category",
        name: name || "Category",
        type,
        fee: Number.isFinite(fee) ? fee : 0,
        currency: "INR",
        maxEntries:
          maxEntries && Number.isFinite(maxEntries) && maxEntries > 0
            ? maxEntries
            : null,
      };
    });
}

function parseCsvLine(line: string): string[] {
  const cells: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (ch === "," && !inQuotes) {
      cells.push(current);
      current = "";
      continue;
    }
    current += ch;
  }
  cells.push(current);
  return cells.map((c) => c.trim());
}

export function parseTournamentCsv(text: string): {
  rows: Record<string, string>[];
  errors: string[];
} {
  const lines = text
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length < 2) {
    return {
      rows: [],
      errors: ["CSV must include a header row and at least one data row."],
    };
  }

  const headers = parseCsvLine(lines[0]).map((h) => h.trim());
  const required = ["name", "startDate", "endDate", "venueName"];
  const missing = required.filter((h) => !headers.includes(h));
  if (missing.length) {
    return {
      rows: [],
      errors: [`Missing required columns: ${missing.join(", ")}`],
    };
  }

  const rows: Record<string, string>[] = [];
  const errors: string[] = [];

  for (let i = 1; i < lines.length; i++) {
    const cells = parseCsvLine(lines[i]);
    if (cells.every((c) => !c)) continue;
    const row: Record<string, string> = {};
    headers.forEach((h, idx) => {
      row[h] = cells[idx] ?? "";
    });
    rows.push(row);
  }

  return { rows, errors };
}

const rowSchema = z.object({
  name: z.string().min(2),
  slug: z.string().optional(),
  description: z.string().optional(),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
  venueName: z.string().min(1),
  venueAddress: z.string().optional(),
  mapLink: z.string().optional(),
  registrationOpensAt: z.string().optional(),
  registrationClosesAt: z.string().optional(),
  reportingTime: z.string().optional(),
  organizerName: z.string().optional(),
  contactEmail: z.string().optional(),
  contactPhone: z.string().optional(),
  status: z.string().optional(),
  bannerUrl: z.string().optional(),
  posterUrl: z.string().optional(),
  prizeDetails: z.string().optional(),
  formatNotes: z.string().optional(),
  scoringRules: z.string().optional(),
  cancellationPolicy: z.string().optional(),
  refundPolicy: z.string().optional(),
  categories: z.string().optional(),
});

export type NormalizedBulkTournament = {
  name: string;
  slug?: string;
  description: string;
  startDate: string;
  endDate: string;
  venueName: string;
  venueAddress: string;
  mapLink: string;
  registrationOpensAt: string | null;
  registrationClosesAt: string | null;
  reportingTime: string;
  organizerName: string;
  contactEmail: string;
  contactPhone: string;
  status: (typeof TOURNAMENT_STATUSES)[number];
  bannerUrl: string;
  posterUrl: string;
  prizeDetails: string;
  formatNotes: string;
  scoringRules: string;
  cancellationPolicy: string;
  refundPolicy: string;
  categories: ReturnType<typeof parseCategories>;
};

export function normalizeBulkRow(
  raw: Record<string, string>,
  rowNumber: number,
):
  | { ok: true; data: NormalizedBulkTournament }
  | { ok: false; error: string } {
  try {
    const parsed = rowSchema.parse({
      ...raw,
      name: raw.name?.trim(),
      venueName: raw.venueName?.trim(),
    });

    const statusRaw = (parsed.status || "draft").trim();
    const status = (TOURNAMENT_STATUSES as readonly string[]).includes(statusRaw)
      ? (statusRaw as (typeof TOURNAMENT_STATUSES)[number])
      : "draft";

    const dates = validateTournamentDates({
      startDate: parsed.startDate,
      endDate: parsed.endDate,
      registrationOpensAt: parsed.registrationOpensAt || null,
      registrationClosesAt: parsed.registrationClosesAt || null,
      allowPastStart: false,
    });
    if (!dates.ok) {
      return { ok: false, error: `Row ${rowNumber}: ${dates.message}` };
    }

    return {
      ok: true,
      data: {
        name: parsed.name,
        slug: parsed.slug?.trim() || undefined,
        description: parsed.description || "",
        startDate: parsed.startDate,
        endDate: parsed.endDate,
        venueName: parsed.venueName,
        venueAddress: parsed.venueAddress || "",
        mapLink: parsed.mapLink || "",
        registrationOpensAt: parsed.registrationOpensAt || null,
        registrationClosesAt: parsed.registrationClosesAt || null,
        reportingTime: parsed.reportingTime || "",
        organizerName:
          parsed.organizerName ||
          "Amateur Telangana Pickleball Association",
        contactEmail: parsed.contactEmail || "",
        contactPhone: parsed.contactPhone || "",
        status,
        bannerUrl: parsed.bannerUrl || "",
        posterUrl: parsed.posterUrl || "",
        prizeDetails: parsed.prizeDetails || "",
        formatNotes: parsed.formatNotes || "",
        scoringRules: parsed.scoringRules || "",
        cancellationPolicy: parsed.cancellationPolicy || "",
        refundPolicy: parsed.refundPolicy || "",
        categories: parseCategories(parsed.categories || ""),
      },
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid row";
    return { ok: false, error: `Row ${rowNumber}: ${message}` };
  }
}

export function buildBulkTemplateCsv(): string {
  const header = BULK_CSV_HEADERS.join(",");
  const example = [
    '"ATPA Hyderabad Open 2026"',
    "hyderabad-open-2026",
    '"Flagship state open"',
    "2026-12-15T09:00",
    "2026-12-16T18:00",
    '"LB Stadium Indoor Courts"',
    "Hyderabad",
    "",
    "2026-11-01T00:00",
    "2026-12-10T23:59",
    "8:00 AM",
    "ATPA",
    "amateurtelanganapickleball@gmail.com",
    "9849194841",
    "draft",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "\"Men's Singles:singles:500|Mixed Doubles:mixed_doubles:800\"",
  ].join(",");
  return `${header}\n${example}\n`;
}
