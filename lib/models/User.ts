import { Schema, models, model, type InferSchemaType, type Types } from "mongoose";
import { ADMIN_ROLES } from "@/lib/constants";

const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ADMIN_ROLES, required: true, default: "viewer" },
    assignedTournamentIds: [{ type: Schema.Types.ObjectId, ref: "Tournament" }],
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export type UserDocument = InferSchemaType<typeof UserSchema> & {
  _id: Types.ObjectId;
};

export const User = models.User || model("User", UserSchema);
