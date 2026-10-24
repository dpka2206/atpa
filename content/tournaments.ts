import type { Tournament } from "@/lib/types";

/** Curated static sample data — replace with CMS/API later. */
export const tournaments: Tournament[] = [
  {
    id: "hyderabad-open-2026",
    name: "ATPA Hyderabad Open 2026",
    date: "15–16 March 2026",
    venue: "LB Stadium Indoor Courts, Hyderabad",
    categories: ["Men's Singles", "Women's Singles", "Mixed Doubles", "35+"],
    registrationDeadline: "1 March 2026",
    status: "open",
    image: "/gallery/IMG-20250226-WA0023.jpg",
    description:
      "Flagship state open featuring age-group and open categories for registered ATPA players.",
  },
  {
    id: "telangana-cup-2026",
    name: "Telangana State Cup",
    date: "18–19 April 2026",
    venue: "Gachibowli Sports Complex, Hyderabad",
    categories: ["Open Doubles", "Junior U18", "Senior 50+"],
    registrationDeadline: "5 April 2026",
    status: "open",
    image: "/gallery/IMG-20250226-WA0007.jpg",
    description:
      "State-level competition open to affiliated clubs and academies across Telangana.",
  },
  {
    id: "grassroots-series-may",
    name: "ATPA Grassroots Series — May",
    date: "10 May 2026",
    venue: "Community Courts, Secunderabad",
    categories: ["Beginner", "Intermediate", "Family Doubles"],
    registrationDeadline: "28 April 2026",
    status: "closing-soon",
    image: "/gallery/IMG-20250226-WA0016.jpg",
    description:
      "Inclusive one-day series designed for first-timers and club-level players.",
  },
  {
    id: "7th-national-lb",
    name: "7th National Pickleball Tournament",
    date: "2024",
    venue: "LB Stadium, Hyderabad",
    categories: ["National Open", "Age Categories"],
    registrationDeadline: "—",
    status: "completed",
    image: "/gallery/IMG-20250226-WA0024.jpg",
    description:
      "National championship hosted in Hyderabad under association support.",
    past: true,
  },
];

export function getUpcomingTournaments(limit = 3): Tournament[] {
  return tournaments.filter((t) => !t.past).slice(0, limit);
}

export function getPastTournaments(): Tournament[] {
  return tournaments.filter((t) => t.past);
}
