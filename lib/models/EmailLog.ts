import { Schema, models, model, type InferSchemaType, type Types } from "mongoose";

const EmailLogSchema = new Schema(
  {
    to: { type: String, required: true },
    subject: { type: String, required: true },
    template: { type: String, required: true },
    status: {
      type: String,
      enum: ["queued", "sent", "failed"],
      default: "queued",
      index: true,
    },
    error: { type: String, default: "" },
    registrationId: { type: String, index: true },
    tournamentId: { type: Schema.Types.ObjectId, ref: "Tournament" },
    attempts: { type: Number, default: 0 },
    meta: { type: Schema.Types.Mixed },
  },
  { timestamps: true },
);

export type EmailLogDocument = InferSchemaType<typeof EmailLogSchema> & {
  _id: Types.ObjectId;
};

export const EmailLog = models.EmailLog || model("EmailLog", EmailLogSchema);
