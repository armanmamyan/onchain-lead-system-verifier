import { z } from "zod";

// Validation schema for ad submissions
export const adSubmissionSchema = z.object({
  adName: z.string().min(3, "Ad name must be at least 3 characters"),
  adDescription: z.string().min(10, "Description must be at least 10 characters"),
  maximumIssuance: z.number().int().positive("Maximum issuance must be a positive number"),
  accessibleFrom: z.date(),
  accessibleUntil: z.date(),
  contactEmail: z.string(),
  contactPersonName: z.string().min(2, "Contact person name must be at least 2 characters"),
});

export type AdSubmissionInput = z.infer<typeof adSubmissionSchema>;

