import { z } from "zod";

const TeamMemberSchema = z.object({
    name: z.string().trim().min(1, "Team member name is required"),
    usn: z.string().trim().optional(),
});

export const RegistrationBodySchema = z.object({
    teamName: z.string().trim().min(1, "Team name is required"),
    leadName: z.string().trim().min(1, "Lead name is required"),
    leadEmail: z.string().trim().email("Valid lead email is required").transform((value) => value.toLowerCase()),
    leadPhone: z.string().trim().min(7, "Lead phone is required"),
    leadUSN: z.string().trim().min(1, "Lead USN is required"),
    teamMembers: z.array(TeamMemberSchema).nullable().optional(),
});

export type RegistrationBody = z.infer<typeof RegistrationBodySchema>;
