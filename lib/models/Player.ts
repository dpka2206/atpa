import { Schema, models, model, type InferSchemaType, type Types } from "mongoose";

const PlayerSchema = new Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
    },
    phone: { type: String, required: true, trim: true },
    dateOfBirth: { type: Date },
    gender: { type: String, trim: true },
    city: { type: String, trim: true },
    district: { type: String, trim: true },
    emergencyContact: { type: String, trim: true },
    membershipId: { type: String, trim: true, index: true },
    skillLevel: { type: String, trim: true },
  },
  { timestamps: true },
);

export type PlayerDocument = InferSchemaType<typeof PlayerSchema> & {
  _id: Types.ObjectId;
};

export const Player = models.Player || model("Player", PlayerSchema);
