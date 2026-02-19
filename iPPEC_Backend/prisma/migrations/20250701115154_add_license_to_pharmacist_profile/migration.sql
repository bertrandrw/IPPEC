/*
  Warnings:

  - A unique constraint covering the columns `[licenceNumber]` on the table `pharmacist_profiles` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "pharmacist_profiles" ADD COLUMN     "licenceNumber" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "pharmacist_profiles_licenceNumber_key" ON "pharmacist_profiles"("licenceNumber");
