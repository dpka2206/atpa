import { Schema, models, model, type InferSchemaType, type Types } from "mongoose";
import {
  CATEGORY_TYPES,
  DEFAULT_FORM_FIELDS,
  TOURNAMENT_STATUSES,
} from "@/lib/constants";

const CategorySchema = new Schema(
  {
    key: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    type: { type: String, enum: CATEGORY_TYPES, required: true },
    ageGroup: { type: String, trim: true },
    skillLevel: { type: String, trim: true },
    fee: { type: Number, default: 0 },
    currency: { type: String, default: "INR" },
    maxEntries: { type: Number },
    eligibilityNotes: { type: String },
  },
  { _id: true },
);

const FormConfigSchema = new Schema(
  {
    fields: {
      type: Schema.Types.Mixed,
      default: () => structuredClone(DEFAULT_FORM_FIELDS),
    },
    successMessage: {
      type: String,
      default:
        "Thank you for registering with ATPA. Check your email for your registration confirmation.",
    },
    emailSubjectTemplate: {
      type: String,
      default: "ATPA Tournament Registration Received — {{tournamentName}}",
    },
  },
  { _id: false },
);

const TournamentSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    tournamentCode: { type: String, required: true, unique: true, trim: true },
    bannerUrl: { type: String, default: "" },
    posterUrl: { type: String, default: "" },
    galleryUrls: [{ type: String }],
    description: { type: String, default: "" },
    organizerName: { type: String, default: "Amateur Telangana Pickleball Association" },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    reportingTime: { type: String, default: "" },
    venueName: { type: String, required: true },
    venueAddress: { type: String, default: "" },
    mapLink: { type: String, default: "" },
    registrationOpensAt: { type: Date },
    registrationClosesAt: { type: Date },
    categories: { type: [CategorySchema], default: [] },
    prizeDetails: { type: String, default: "" },
    formatNotes: { type: String, default: "" },
    scoringRules: { type: String, default: "" },
    documentUrls: [{ type: String }],
    cancellationPolicy: { type: String, default: "" },
    refundPolicy: { type: String, default: "" },
    contactEmail: { type: String, default: "" },
    contactPhone: { type: String, default: "" },
    status: {
      type: String,
      enum: TOURNAMENT_STATUSES,
      default: "draft",
      index: true,
    },
    formConfig: { type: FormConfigSchema, default: () => ({}) },
  },
  { timestamps: true },
);

TournamentSchema.index({ status: 1, startDate: 1 });

export type TournamentDocument = InferSchemaType<typeof TournamentSchema> & {
  _id: Types.ObjectId;
};

export const Tournament =
  models.Tournament || model("Tournament", TournamentSchema);
