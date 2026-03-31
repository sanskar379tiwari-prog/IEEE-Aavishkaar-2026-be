import { Schema, model, type InferSchemaType } from "mongoose";

const EventSchema = new Schema(
    {
        title: { type: String, required: true, trim: true },
        minTeamSize: { type: Number, required: true, default: 1, min: 1 },
        maxTeamSize: { type: Number, required: true, default: 1, min: 1 },
        maxCapacity: { type: Number, required: true, min: 1 },
        currentReg: { type: Number, required: true, default: 0, min: 0 },
        registrationStatus: {
            type: String,
            enum: ["OPEN", "CLOSED", "FULL"],
            default: "OPEN",
        },
        isVisible: { type: Boolean, default: true },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

export type EventDocument = InferSchemaType<typeof EventSchema>;
export const EventModel = model<EventDocument>("Event", EventSchema);
