import { Schema, models, model, type InferSchemaType, type Types } from "mongoose";

const AuditLogSchema = new Schema(
  {
    actorUserId: { type: Schema.Types.ObjectId, ref: "User" },
    actorEmail: { type: String },
    action: { type: String, required: true },
    entityType: { type: String, required: true },
    entityId: { type: String },
    details: { type: Schema.Types.Mixed },
  },
  { timestamps: true },
);

AuditLogSchema.index({ createdAt: -1 });

export type AuditLogDocument = InferSchemaType<typeof AuditLogSchema> & {
  _id: Types.ObjectId;
};

export const AuditLog = models.AuditLog || model("AuditLog", AuditLogSchema);
