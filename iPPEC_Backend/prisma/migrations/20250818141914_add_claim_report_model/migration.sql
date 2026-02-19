-- CreateEnum
CREATE TYPE "ClaimStatus" AS ENUM ('GENERATED', 'SUBMITTED', 'PROCESSING', 'APPROVED', 'REJECTED', 'PAID');

-- AlterTable
ALTER TABLE "prescriptions" ADD COLUMN     "claimReportId" TEXT;

-- CreateTable
CREATE TABLE "claim_reports" (
    "id" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "status" "ClaimStatus" NOT NULL DEFAULT 'SUBMITTED',
    "pharmacyId" TEXT NOT NULL,
    "insuranceCompanyId" TEXT NOT NULL,
    "totalAmount" DECIMAL(12,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "claim_reports_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_claimReportId_fkey" FOREIGN KEY ("claimReportId") REFERENCES "claim_reports"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "claim_reports" ADD CONSTRAINT "claim_reports_pharmacyId_fkey" FOREIGN KEY ("pharmacyId") REFERENCES "pharmacies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "claim_reports" ADD CONSTRAINT "claim_reports_insuranceCompanyId_fkey" FOREIGN KEY ("insuranceCompanyId") REFERENCES "insurance_companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
