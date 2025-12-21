"use server";

import prisma from "@/lib/prisma";
import { z } from "zod";
import {
  createUserSchema,
  updateVerificationSchema,
  type CreateUserInput,
  type UpdateVerificationInput,
} from "@/lib/schemas/user";

// Create or update user during credential issuance
export async function createOrUpdateUser(data: CreateUserInput) {
  try {
    const validated = createUserSchema.parse(data);

    // Check if user exists by wallet address
    const existingUser = await prisma.user.findUnique({
      where: { walletAddress: validated.walletAddress },
    });

    if (existingUser) {
      // Update existing user
      const user = await prisma.user.update({
        where: { walletAddress: validated.walletAddress },
        data: {
          airKitId: validated.airKitId,
          airKitEmail: validated.airKitEmail,
          isCredentialIssued: validated.isCredentialIssued ?? true,
          credentialSubject: validated.credentialSubject ?? undefined,
        },
      });
      return { success: true, data: user, isNewUser: false };
    }

    // Create new user
    const user = await prisma.user.create({
      data: {
        walletAddress: validated.walletAddress,
        airKitId: validated.airKitId,
        airKitEmail: validated.airKitEmail,
        isCredentialIssued: validated.isCredentialIssued ?? true,
        credentialSubject: validated.credentialSubject ?? undefined,
      },
    });

    return { success: true, data: user, isNewUser: true };
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.message };
    }
    console.error("Error creating/updating user:", error);
    return { success: false, error: "Failed to create/update user" };
  }
}

// Get user by AIR Kit ID
export async function getUserByAirKitId(airKitId: string) {
  try {
    if (!airKitId) {
      return { success: false, error: "AIR Kit ID is required" };
    }

    const user = await prisma.user.findFirst({
      where: { airKitId },
    });

    if (!user) {
      return { success: false, error: "User not found", data: null };
    }

    return { success: true, data: user };
  } catch (error) {
    console.error("Error fetching user:", error);
    return { success: false, error: "Failed to fetch user" };
  }
}

// Get user by wallet address
export async function getUserByWalletAddress(walletAddress: string) {
  try {
    if (!walletAddress) {
      return { success: false, error: "Wallet address is required" };
    }

    const user = await prisma.user.findUnique({
      where: { walletAddress },
    });

    if (!user) {
      return { success: false, error: "User not found", data: null };
    }

    return { success: true, data: user };
  } catch (error) {
    console.error("Error fetching user:", error);
    return { success: false, error: "Failed to fetch user" };
  }
}

// Update user verification status
export async function updateUserVerification(data: UpdateVerificationInput) {
  try {
    const validated = updateVerificationSchema.parse(data);

    const user = await prisma.user.findFirst({
      where: { airKitId: validated.airKitId },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: validated.isVerified,
        verifiedAt: validated.isVerified ? new Date() : null,
      },
    });

    return { success: true, data: updatedUser };
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.message };
    }
    console.error("Error updating verification:", error);
    return { success: false, error: "Failed to update verification status" };
  }
}

// Check if user exists and get their status
export async function checkUserStatus(airKitId: string) {
  try {
    if (!airKitId) {
      return { 
        success: false, 
        exists: false, 
        hasCredential: false, 
        isVerified: false,
        error: "AIR Kit ID is required" 
      };
    }

    const user = await prisma.user.findFirst({
      where: { airKitId },
    });

    if (!user) {
      return { 
        success: true, 
        exists: false, 
        hasCredential: false, 
        isVerified: false,
        data: null 
      };
    }

    return { 
      success: true, 
      exists: true, 
      hasCredential: user.isCredentialIssued,
      isVerified: user.isVerified,
      data: user 
    };
  } catch (error) {
    console.error("Error checking user status:", error);
    return { 
      success: false, 
      exists: false, 
      hasCredential: false, 
      isVerified: false,
      error: "Failed to check user status" 
    };
  }
}
