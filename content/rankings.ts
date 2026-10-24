import type { Champion, RankingEntry } from "@/lib/types";

export const champions: Champion[] = [
  {
    tournament: "7th National Pickleball Tournament",
    category: "Men's Doubles",
    winners: "Hyderabad pair — National podium",
    year: "2024",
  },
  {
    tournament: "ATPA State Invitationals",
    category: "Women's Singles",
    winners: "Telangana State Champion",
    year: "2025",
  },
  {
    tournament: "Grassroots Series Finals",
    category: "Mixed Doubles",
    winners: "Club Circuit Champions",
    year: "2025",
  },
];

export const playerRankings: RankingEntry[] = [
  { rank: 1, name: "R. Krishnan", points: 1240, category: "Men's Singles" },
  { rank: 2, name: "A. Reddy", points: 1185, category: "Men's Singles" },
  { rank: 3, name: "S. Mehta", points: 1090, category: "Men's Singles" },
  { rank: 1, name: "P. Sharma", points: 1210, category: "Women's Singles" },
  { rank: 2, name: "N. Fatima", points: 1140, category: "Women's Singles" },
  { rank: 3, name: "K. Rao", points: 1025, category: "Women's Singles" },
];

export const recentResults = [
  {
    id: "r1",
    title: "State Invitationals — Finals published",
    date: "12 Jan 2026",
    summary: "Category-wise podium results and match sheets now available.",
  },
  {
    id: "r2",
    title: "Grassroots Series Round 3 scores",
    date: "5 Jan 2026",
    summary: "Beginner and intermediate draws updated for club players.",
  },
];
