import { z } from "zod";

export const createUserSchema = z.object({
  walletAddress: z.string().min(1, "Wallet address is required"),
  airKitId: z.string(),
  airKitEmail: z.string(),
  isCredentialIssued: z.boolean(),
  credentialSubject: z.string(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

export const updateVerificationSchema = z.object({
  airKitId: z.string().min(1, "AIR Kit ID is required"),
  isVerified: z.boolean(),
});

export type UpdateVerificationInput = z.infer<typeof updateVerificationSchema>;

