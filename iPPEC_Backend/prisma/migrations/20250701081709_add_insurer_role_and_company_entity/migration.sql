/*
  Warnings:

  - A unique constraint covering the columns `[licenceNumber]` on the table `doctor_profiles` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[contactEmail]` on the table `insurance_companies` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'INSURER';

-- AlterTable
ALTER TABLE "doctor_profiles" ADD COLUMN     "licenceNumber" TEXT;

-- AlterTable
ALTER TABLE "insurance_companies" ADD COLUMN     "contactEmail" TEXT,
ADD COLUMN     "contactPhone" TEXT;

-- CreateTable
CREATE TABLE "insurer_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "insuranceCompanyId" TEXT NOT NULL,

    CONSTRAINT "insurer_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "insurer_profiles_userId_key" ON "insurer_profiles"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "doctor_profiles_licenceNumber_key" ON "doctor_profiles"("licenceNumber");

-- CreateIndex
CREATE UNIQUE INDEX "insurance_companies_contactEmail_key" ON "insurance_companies"("contactEmail");

-- AddForeignKey
ALTER TABLE "insurer_profiles" ADD CONSTRAINT "insurer_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "insurer_profiles" ADD CONSTRAINT "insurer_profiles_insuranceCompanyId_fkey" FOREIGN KEY ("insuranceCompanyId") REFERENCES "insurance_companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
