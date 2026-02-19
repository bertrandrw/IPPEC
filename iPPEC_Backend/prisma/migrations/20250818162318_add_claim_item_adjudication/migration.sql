/*
  Warnings:

  - You are about to drop the column `claimReportId` on the `prescriptions` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ClaimItemStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- DropForeignKey
ALTER TABLE "prescriptions" DROP CONSTRAINT "prescriptions_claimReportId_fkey";

-- AlterTable
ALTER TABLE "claim_reports" ADD COLUMN     "approvedAmount" DECIMAL(12,2);

-- AlterTable
ALTER TABLE "prescriptions" DROP COLUMN "claimReportId";

-- CreateTable
CREATE TABLE "claim_items" (
    "id" TEXT NOT NULL,
    "status" "ClaimItemStatus" NOT NULL DEFAULT 'PENDING',
    "rejectionReason" TEXT,
    "claimReportId" TEXT NOT NULL,
    "prescriptionId" TEXT NOT NULL,

    CONSTRAINT "claim_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "claim_items_prescriptionId_key" ON "claim_items"("prescriptionId");

-- AddForeignKey
ALTER TABLE "claim_items" ADD CONSTRAINT "claim_items_claimReportId_fkey" FOREIGN KEY ("claimReportId") REFERENCES "claim_reports"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "claim_items" ADD CONSTRAINT "claim_items_prescriptionId_fkey" FOREIGN KEY ("prescriptionId") REFERENCES "prescriptions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
