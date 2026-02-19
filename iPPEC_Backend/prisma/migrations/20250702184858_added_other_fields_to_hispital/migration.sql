/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `hospitals` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "FacilityType" AS ENUM ('HOSPITAL', 'CLINIC', 'HEALTH_CENTER', 'POLYCLINIC', 'OTHER');

-- CreateEnum
CREATE TYPE "Ownership" AS ENUM ('PRIVATE', 'GOVERNMENT', 'NGO', 'OTHER');

-- AlterTable
ALTER TABLE "hospitals" ADD COLUMN     "email" TEXT,
ADD COLUMN     "emergencyPhone" TEXT,
ADD COLUMN     "facilityHeadDesignation" TEXT,
ADD COLUMN     "facilityHeadEmail" TEXT,
ADD COLUMN     "facilityHeadName" TEXT,
ADD COLUMN     "facilityHeadPhone" TEXT,
ADD COLUMN     "ownership" "Ownership" NOT NULL DEFAULT 'PRIVATE',
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "type" "FacilityType" NOT NULL DEFAULT 'HOSPITAL',
ADD COLUMN     "website" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "hospitals_email_key" ON "hospitals"("email");
