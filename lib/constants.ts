export const ADMIN_ROLES = [
  "super_admin",
  "association_admin",
  "tournament_manager",
  "viewer",
] as const;

export type AdminRole = (typeof ADMIN_ROLES)[number];

export const TOURNAMENT_STATUSES = [
  "draft",
  "published",
  "registration_open",
  "registration_closed",
  "draws_published",
  "in_progress",
  "completed",
  "archived",
] as const;

export type TournamentStatus = (typeof TOURNAMENT_STATUSES)[number];

/** Statuses visible on the public website */
export const PUBLIC_TOURNAMENT_STATUSES: TournamentStatus[] = [
  "published",
  "registration_open",
  "registration_closed",
  "draws_published",
  "in_progress",
  "completed",
];

export const ACTIVE_TOURNAMENT_STATUSES: TournamentStatus[] = [
  "published",
  "registration_open",
  "registration_closed",
  "draws_published",
  "in_progress",
];

export const REGISTRATION_STATUSES = [
  "submitted",
  "awaiting_review",
  "confirmed",
  "rejected",
  "cancelled",
  "waitlisted",
] as const;

export type RegistrationStatus = (typeof REGISTRATION_STATUSES)[number];

export const PAYMENT_STATUSES = [
  "pending",
  "processing",
  "paid",
  "failed",
  "refunded",
  "partially_refunded",
  "not_applicable",
] as const;

export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export const CATEGORY_TYPES = ["singles", "doubles", "mixed_doubles"] as const;
export type CategoryType = (typeof CATEGORY_TYPES)[number];

export const DEFAULT_FORM_FIELDS = {
  fullName: { enabled: true, required: true },
  email: { enabled: true, required: true },
  phone: { enabled: true, required: true },
  dateOfBirth: { enabled: true, required: false },
  gender: { enabled: true, required: false },
  city: { enabled: true, required: false },
  district: { enabled: true, required: false },
  emergencyContact: { enabled: false, required: false },
  skillLevel: { enabled: true, required: false },
  partnerName: { enabled: true, required: false },
  membershipId: { enabled: true, required: false },
  rulesConsent: { enabled: true, required: true },
  privacyConsent: { enabled: true, required: true },
  photoConsent: { enabled: true, required: false },
} as const;
