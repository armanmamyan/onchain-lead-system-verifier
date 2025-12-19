-- CreateEnum
CREATE TYPE "AdSubmissionStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'ACTIVE', 'EXPIRED');

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdSubmission" (
    "id" TEXT NOT NULL,
    "adName" TEXT NOT NULL,
    "adDescription" TEXT NOT NULL,
    "maximumIssuance" INTEGER NOT NULL,
    "accessibleFrom" TIMESTAMP(3) NOT NULL,
    "accessibleUntil" TIMESTAMP(3) NOT NULL,
    "contactEmail" TEXT NOT NULL,
    "contactPersonName" TEXT NOT NULL,
    "status" "AdSubmissionStatus" NOT NULL DEFAULT 'PENDING',
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_username_key" ON "Admin"("username");

-- CreateIndex
CREATE INDEX "AdSubmission_status_idx" ON "AdSubmission"("status");

-- CreateIndex
CREATE INDEX "AdSubmission_createdAt_idx" ON "AdSubmission"("createdAt");

-- AddForeignKey
ALTER TABLE "AdSubmission" ADD CONSTRAINT "AdSubmission_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;
