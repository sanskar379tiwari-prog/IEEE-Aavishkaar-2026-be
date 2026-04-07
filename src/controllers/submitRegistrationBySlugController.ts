import type { Request, Response } from "express";
import mongoose from "mongoose";
import { z } from "zod";
import { EventModel } from "../models/Event";
import { RegistrationModel } from "../models/Registration";

const registrationPayloadSchema = z.object({
  teamName: z.string(),
  leadName: z.string(),
  leadEmail: z.string().email(),
  leadPhone: z.string(),
  leadUSN: z.string(),
  teamMembers: z
    .array(
      z.object({
        name: z.string(),
        usn: z.string().optional(),
      })
    )
    .min(1),
});

export async function submitRegistrationBySlugController(req: Request, res: Response) {
  try {
    const payload = registrationPayloadSchema.parse(req.body);
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    // Try to find event by ID first, then by slug as fallback
    let event;
    if (mongoose.Types.ObjectId.isValid(id)) {
      event = await EventModel.findById(id);
    }
    if (!event) {
      event = await EventModel.findOne({ slug: id });
    }
    
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    const existingRegistration = await RegistrationModel.findOne({
      eventId: event._id,
      leadEmail: payload.leadEmail.toLowerCase(),
    });
    if (existingRegistration) {
      return res.status(409).json({ error: "Duplicate registration detected for this event using the same lead email." });
    }

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

    const referenceId = `TF-${event.title.slice(0, 4).toUpperCase()}-${registration._id.toString().slice(-6).toUpperCase()}`;
    res.status(201).json({ 
      ok: true, 
      referenceId, 
      registration,
      message: "Registration successful! Your spot is secured."
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid registration payload", details: err.issues });
    }
    res.status(500).json({ error: (err as Error).message });
  }
}
