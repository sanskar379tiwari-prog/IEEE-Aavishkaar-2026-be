import { z } from "zod";

export const registrationSchema = z.object({
  _id: z.string().optional(),

  eventId: z.string(),

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
    .nullable(),

  registeredAt: z.coerce.date().optional(),
});

// Type for TypeScript (VERY USEFUL)
export type RegistrationType = z.infer<typeof registrationSchema>;