import type { Request, Response } from "express";
import mongoose from "mongoose";
import { EventModel } from "../models/Event";

export async function getEventBySlugController(req: Request, res: Response) {
  try {
    const slug = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;

    // Try to find by ID first (if it's a valid MongoDB ObjectId)
    let event;
    if (mongoose.Types.ObjectId.isValid(slug)) {
      event = await EventModel.findById(slug);
    }
    // If not found by ID, try by slug
    if (!event) {
      event = await EventModel.findOne({ slug, isVisible: true });
    }
    
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
}
