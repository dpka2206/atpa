/** Initials from the first letters of the first two words (e.g. "Hyderabad Open" → "HO"). */
export function tournamentInitials(name: string): string {
  const words = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .filter((w) => /[a-zA-Z0-9]/.test(w));

  if (words.length === 0) return "AT";
  if (words.length === 1) {
    const w = words[0].replace(/[^a-zA-Z0-9]/g, "");
    return (w.slice(0, 2) || "AT").toUpperCase();
  }

  const a = words[0].replace(/[^a-zA-Z0-9]/g, "")[0] || "";
  const b = words[1].replace(/[^a-zA-Z0-9]/g, "")[0] || "";
  return `${a}${b}`.toUpperCase() || "AT";
}

export function hasTournamentImage(url?: string | null): boolean {
  return Boolean(url && url.trim() && !url.startsWith("initials:"));
}
