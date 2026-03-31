import { Schema, model, type InferSchemaType, Types } from "mongoose";

const TeamMemberSchema = new Schema(
    {
        name: { type: String, required: true, trim: true },
        usn: { type: String, required: false, trim: true, default: null },
    },
    { _id: false },
);

const RegistrationSchema = new Schema(
    {
        eventId: { type: Types.ObjectId, ref: "Event", required: true, index: true },
        teamName: { type: String, required: true, trim: true },
        leadName: { type: String, required: true, trim: true },
        normalizedLeadName: { type: String, required: true, trim: true },
        leadEmail: { type: String, required: true, trim: true, lowercase: true },
        leadPhone: { type: String, required: true, trim: true },
        leadUSN: { type: String, required: true, trim: true },
        teamMembers: { type: [TeamMemberSchema], default: null },
        registeredAt: { type: Date, default: Date.now },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

RegistrationSchema.index(
    { eventId: 1, leadEmail: 1, leadPhone: 1, normalizedLeadName: 1 },
    { unique: true },
);

export type RegistrationDocument = InferSchemaType<typeof RegistrationSchema>;
export const RegistrationModel = model<RegistrationDocument>("Registration", RegistrationSchema);
