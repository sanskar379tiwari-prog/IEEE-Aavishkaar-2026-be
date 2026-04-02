import { z } from "zod";

export const eventSchema = z.object({
  _id: z.string().optional(), 

  organizerId: z.string(),

  title: z.string(),

  slug: z.string(),

  tagline: z.string().optional(),

  description: z.string(),

  posterURL: z.string().url().optional(),

  dateTime: z.coerce.date(), // handles string → Date

  venue: z.string().nullable(),

  prizePool: z.array(
    z.object({
      position: z.number(),
      amount: z.number(),
    })
  ),

  minTeamSize: z.number().int().default(1),

  maxTeamSize: z.number().int().default(1),

  maxCapacity: z.number().int(),

  registrationStatus: z.enum(["OPEN", "CLOSED", "FULL"]).default("OPEN"),

  isVisible: z.boolean().default(true),

  registrationFees: z
    .object({
      standard: z.number(),
      ieeeMember: z.number(),
    })
    .nullable()
    .optional(),

  rules: z.array(z.string()),

  faqs: z.array(
    z.object({
      question: z.string(),
      answer: z.string(),
    })
  ),

  coordinators: z.array(
    z.object({
      name: z.string(),
      contactNumber: z.string(),
    })
  ),
});