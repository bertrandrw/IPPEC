/*
  Warnings:

  - You are about to drop the column `coveragePercentage` on the `insurance_acceptances` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "insurance_acceptances" DROP COLUMN "coveragePercentage";

-- AlterTable
ALTER TABLE "patient_profiles" ADD COLUMN     "coveragePercentage" DOUBLE PRECISION;
