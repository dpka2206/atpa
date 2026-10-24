export type TournamentDateInput = {
  startDate: string;
  endDate: string;
  registrationOpensAt?: string | null;
  registrationClosesAt?: string | null;
  /** When editing an existing event that already started */
  allowPastStart?: boolean;
};

export type FieldErrors = Record<string, string>;

function parseDate(value: string | null | undefined): Date | null {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Shared client/server date rules for tournament create/update. */
export function validateTournamentDates(
  input: TournamentDateInput,
): { ok: true } | { ok: false; errors: FieldErrors; message: string } {
  const errors: FieldErrors = {};
  const start = parseDate(input.startDate);
  const end = parseDate(input.endDate);
  const opens = parseDate(input.registrationOpensAt || undefined);
  const closes = parseDate(input.registrationClosesAt || undefined);
  const today = startOfToday();

  if (!input.startDate?.trim()) {
    errors.startDate = "Start date is required.";
  } else if (!start) {
    errors.startDate = "Enter a valid start date and time.";
  } else if (!input.allowPastStart && start < today) {
    errors.startDate = "Start date cannot be in the past.";
  }

  if (!input.endDate?.trim()) {
    errors.endDate = "End date is required.";
  } else if (!end) {
    errors.endDate = "Enter a valid end date and time.";
  } else if (start && end < start) {
    errors.endDate = "End date must be on or after the start date.";
  }

  if (input.registrationOpensAt && !opens) {
    errors.registrationOpensAt = "Enter a valid registration opening date.";
  }
  if (input.registrationClosesAt && !closes) {
    errors.registrationClosesAt = "Enter a valid registration closing date.";
  }

  if (opens && !input.allowPastStart && opens < today) {
    errors.registrationOpensAt =
      "Registration opening date cannot be in the past.";
  }

  if (opens && closes && closes < opens) {
    errors.registrationClosesAt =
      "Registration must close on or after it opens.";
  }

  if (closes && start && closes > start) {
    errors.registrationClosesAt =
      "Registration must close on or before the tournament start.";
  }

  if (opens && start && opens > start) {
    errors.registrationOpensAt =
      "Registration cannot open after the tournament starts.";
  }

  const keys = Object.keys(errors);
  if (keys.length) {
    return {
      ok: false,
      errors,
      message: errors[keys[0]],
    };
  }
  return { ok: true };
}

export function toDatetimeLocalMin(from: Date = new Date()): string {
  const d = new Date(from);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
