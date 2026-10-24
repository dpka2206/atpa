export type RegistrationStatus = "open" | "closing-soon" | "closed" | "completed";

export interface Tournament {
  id: string;
  name: string;
  date: string;
  venue: string;
  categories: string[];
  registrationDeadline: string;
  status: RegistrationStatus;
  image: string;
  description?: string;
  past?: boolean;
}

export interface RankingEntry {
  rank: number;
  name: string;
  points: number;
  category: string;
}

export interface Champion {
  tournament: string;
  category: string;
  winners: string;
  year: string;
}

export interface Club {
  id: string;
  name: string;
  location: string;
  type: "club" | "court" | "academy";
  description: string;
  image: string;
}

export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: "tournament" | "registration" | "achievement" | "association";
  href: string;
}

export interface Partner {
  id: string;
  name: string;
  logo: string;
  href?: string;
}

export interface CommitteeMember {
  role: string;
  names: string[];
}
