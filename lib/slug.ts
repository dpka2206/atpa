export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function makeTournamentCode(name: string): string {
  const year = new Date().getFullYear();
  const base = name
    .replace(/[^a-zA-Z0-9]+/g, "")
    .toUpperCase()
    .slice(0, 8);
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `ATPA-${year}-${base || "EVT"}-${rand}`;
}

export function makeRegistrationId(): string {
  const year = new Date().getFullYear();
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `ATPA-${year}-${rand}`;
}
