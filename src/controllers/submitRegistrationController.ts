import type { Request, Response } from "express";
import { z } from "zod";
import { EventModel } from "../models/Event";
import { RegistrationModel } from "../models/Registration";

const registrationPayloadSchema = z.object({
  eventSlug: z.string().min(1, "Event slug is required"),
  teamName: z.string().min(1, "Team name is required"),
  leadName: z.string().min(1, "Lead name is required"),
  leadEmail: z.string().email("Invalid email"),
  leadPhone: z.string().min(1, "Phone is required"),
  leadUSN: z.string().min(1, "USN is required"),
  teamMembers: z
    .array(
      z.object({
        name: z.string().min(1, "Member name is required"),
        usn: z.string().optional(),
      })
    )
    .min(1, "At least one member is required"),
});

export async function submitRegistrationController(req: Request, res: Response) {
  try {
    const payload = registrationPayloadSchema.parse(req.body);

    // Find event by slug
    const event = await EventModel.findOne({ slug: payload.eventSlug });
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Check if registration is still open
    if (event.registrationStatus === "CLOSED") {
      return res.status(400).json({ error: "Registration for this event is closed" });
    }

    if (event.registrationStatus === "FULL") {
      return res.status(400).json({ error: "Event is at full capacity" });
    }

    const existingRegistration = await RegistrationModel.findOne({
      eventId: event._id,
      leadEmail: payload.leadEmail.toLowerCase(),
    });
    if (existingRegistration) {
      return res.status(409).json({ error: "Duplicate registration detected for this event using the same lead email." });
    }

    // Create registration
    const registration = new RegistrationModel({
      eventId: event._id,
      teamName: payload.teamName,
      leadName: payload.leadName,
      leadEmail: payload.leadEmail.toLowerCase(),
      leadPhone: payload.leadPhone,
      leadUSN: payload.leadUSN,
      teamMembers: payload.teamMembers,
    });

    await registration.save();
    // Generate reference ID
    const referenceId = `TF-${payload.eventSlug.slice(0, 4).toUpperCase()}-${registration._id.toString().slice(-6).toUpperCase()}`;
    
    res.status(201).json({ 
      ok: true, 
      referenceId, 
      registration,
      message: "Registration successful! Your spot is secured."
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ 
        error: "Invalid registration payload", 
        details: err.issues 
      });
    }
    res.status(500).json({ error: (err as Error).message });
  }
}
