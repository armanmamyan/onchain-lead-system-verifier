"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { adSubmissionSchema, type AdSubmissionInput } from "@/lib/schemas/ad-submission";

export async function createAdSubmission(data: AdSubmissionInput, createdById?: string) {
  try {
    const validated = adSubmissionSchema.parse(data);

    // Manual date validation
    if (validated.accessibleUntil.getTime() <= validated.accessibleFrom.getTime()) {
      return { success: false, error: "End date must be after start date" };
    }

    const submission = await prisma.adSubmission.create({
      data: {
        ...validated,
        createdById,
      },
    });

    revalidatePath("/admin");
    return { success: true, data: submission };
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to create ad submission" };
  }
}

// Get all ad submissions
export async function getAllAdSubmissions() {
  try {
    const submissions = await prisma.adSubmission.findMany({
      include: {
        createdBy: {
          select: {
            username: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { success: true, data: submissions };
  } catch (error) {
    return { success: false, error: "Failed to fetch ad submissions" };
  }
}

// Get ad submission by ID
export async function getAdSubmissionById(id: string) {
  try {
    const submission = await prisma.adSubmission.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: {
            username: true,
          },
        },
      },
    });

    if (!submission) {
      return { success: false, error: "Ad submission not found" };
    }

    return { success: true, data: submission };
  } catch (error) {
    return { success: false, error: "Failed to fetch ad submission" };
  }
}

// Update ad submission status
export async function updateAdSubmissionStatus(
  id: string,
  status: "PENDING" | "APPROVED" | "REJECTED" | "ACTIVE" | "EXPIRED"
) {
  try {
    const submission = await prisma.adSubmission.update({
      where: { id },
      data: { status },
    });

    revalidatePath("/admin");
    return { success: true, data: submission };
  } catch (error) {
    return { success: false, error: "Failed to update ad submission status" };
  }
}

// Delete ad submission
export async function deleteAdSubmission(id: string) {
  try {
    await prisma.adSubmission.delete({
      where: { id },
    });

    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete ad submission" };
  }
}

// Get submissions count by status
export async function getAdSubmissionsStats() {
  try {
    const [total, pending, approved, active, rejected, expired] = await Promise.all([
      prisma.adSubmission.count(),
      prisma.adSubmission.count({ where: { status: "PENDING" } }),
      prisma.adSubmission.count({ where: { status: "APPROVED" } }),
      prisma.adSubmission.count({ where: { status: "ACTIVE" } }),
      prisma.adSubmission.count({ where: { status: "REJECTED" } }),
      prisma.adSubmission.count({ where: { status: "EXPIRED" } }),
    ]);

    return {
      success: true,
      data: { total, pending, approved, active, rejected, expired },
    };
  } catch (error) {
    return { success: false, error: "Failed to fetch statistics" };
  }
}
