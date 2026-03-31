import { Types } from "mongoose";
import { EventModel } from "@/models/event";
import { RegistrationModel } from "@/models/registration";
import type { RegistrationBody } from "@/schemas/registration";

export class ApiError extends Error {
    statusCode: number;

    constructor(statusCode: number, message: string) {
        super(message);
        this.statusCode = statusCode;
    }
}

function normalizeName(name: string): string {
    return name.trim().toLowerCase().replace(/\s+/g, " ");
}

function getTeamCount(teamMembers: RegistrationBody["teamMembers"]): number {
    if (!teamMembers || teamMembers.length === 0) {
        return 1;
    }

    return teamMembers.length + 1;
}

export async function registerForEvent(eventId: string, payload: RegistrationBody) {
    if (!Types.ObjectId.isValid(eventId)) {
        throw new ApiError(400, "Invalid eventId");
    }

    const event = await EventModel.findById(eventId).lean();
    if (!event) {
        throw new ApiError(404, "Event not found");
    }

    if (!event.isVisible || event.registrationStatus === "CLOSED") {
        throw new ApiError(403, "Registration is closed for this event");
    }

    if (event.registrationStatus === "FULL") {
        throw new ApiError(403, "Event is full");
    }

    const teamCount = getTeamCount(payload.teamMembers);
    if (teamCount < event.minTeamSize || teamCount > event.maxTeamSize) {
        throw new ApiError(
            400,
            `Team size must be between ${event.minTeamSize} and ${event.maxTeamSize}`,
        );
    }

    const eventAfterIncrement = await EventModel.findOneAndUpdate(
        {
            _id: eventId,
            isVisible: true,
            registrationStatus: "OPEN",
            $expr: { $lt: ["$currentReg", "$maxCapacity"] },
        },
        { $inc: { currentReg: 1 } },
        { new: true },
    ).lean();

    if (!eventAfterIncrement) {
        await EventModel.findByIdAndUpdate(eventId, { registrationStatus: "FULL" });
        throw new ApiError(403, "Event capacity is full");
    }

    try {
        const registration = await RegistrationModel.create({
            eventId,
            teamName: payload.teamName,
            leadName: payload.leadName,
            normalizedLeadName: normalizeName(payload.leadName),
            leadEmail: payload.leadEmail,
            leadPhone: payload.leadPhone,
            leadUSN: payload.leadUSN,
            teamMembers: payload.teamMembers && payload.teamMembers.length > 0 ? payload.teamMembers : null,
        });

        if (eventAfterIncrement.currentReg >= eventAfterIncrement.maxCapacity) {
            await EventModel.findByIdAndUpdate(eventId, { registrationStatus: "FULL" });
        }

        return registration;
    } catch (error) {
        await EventModel.findByIdAndUpdate(eventId, { $inc: { currentReg: -1 } });

        const mongoError = error as { code?: number };
        if (mongoError?.code === 11000) {
            throw new ApiError(409, "Duplicate registration is not allowed for this event");
        }

        throw error;
    }
}
