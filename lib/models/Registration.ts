import { Schema, models, model, type InferSchemaType, type Types } from "mongoose";
import { PAYMENT_STATUSES, REGISTRATION_STATUSES } from "@/lib/constants";

const RegistrationSchema = new Schema(
  {
    registrationId: { type: String, required: true, unique: true, index: true },
    tournamentId: {
      type: Schema.Types.ObjectId,
      ref: "Tournament",
      required: true,
      index: true,
    },
    playerId: {
      type: Schema.Types.ObjectId,
      ref: "Player",
      required: true,
      index: true,
    },
    categoryId: { type: Schema.Types.ObjectId, required: true },
    categoryKey: { type: String, required: true },
    categoryName: { type: String, required: true },
    partnerName: { type: String, default: "" },
    answers: { type: Schema.Types.Mixed, default: {} },
    registrationStatus: {
      type: String,
      enum: REGISTRATION_STATUSES,
      default: "awaiting_review",
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: PAYMENT_STATUSES,
      default: "not_applicable",
      index: true,
    },
    feeAmount: { type: Number, default: 0 },
    currency: { type: String, default: "INR" },
    internalNotes: { type: String, default: "" },
    rejectionReason: { type: String, default: "" },
    playerSnapshot: {
      fullName: String,
      email: String,
      phone: String,
      city: String,
      district: String,
      dateOfBirth: Date,
      gender: String,
      skillLevel: String,
      membershipId: String,
      emergencyContact: String,
    },
    idempotencyKey: { type: String, index: true },
  },
  { timestamps: true },
);

RegistrationSchema.index(
  { tournamentId: 1, "playerSnapshot.email": 1, categoryId: 1 },
  { unique: true },
);
RegistrationSchema.index({ tournamentId: 1, createdAt: -1 });
RegistrationSchema.index({
  "playerSnapshot.fullName": "text",
  "playerSnapshot.email": "text",
  registrationId: "text",
});

export type RegistrationDocument = InferSchemaType<typeof RegistrationSchema> & {
  _id: Types.ObjectId;
};

export const Registration =
  models.Registration || model("Registration", RegistrationSchema);
