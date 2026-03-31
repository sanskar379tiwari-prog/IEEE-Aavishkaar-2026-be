import type { Request, Response } from "express";
import { ZodError } from "zod";
import { RegistrationBodySchema } from "@/schemas/registration";
import { ApiError, registerForEvent } from "@/services/registration";

export async function registrationController(request: Request, response: Response) {
    try {
        const body = RegistrationBodySchema.parse(request.body);
        const eventId = Array.isArray(request.params.eventId)
            ? request.params.eventId[0]
            : request.params.eventId;
        const registration = await registerForEvent(eventId, body);

        return response.status(201).json({
            message: "Registration successful",
            data: registration,
        });
    } catch (error) {
        if (error instanceof ZodError) {
            return response.status(400).json({
                message: "Validation failed",
                errors: error.issues.map((issue) => ({
                    path: issue.path.join("."),
                    message: issue.message,
                })),
            });
        }

        if (error instanceof ApiError) {
            return response.status(error.statusCode).json({ message: error.message });
        }

        return response.status(500).json({ message: "Something went wrong" });
    }
}
