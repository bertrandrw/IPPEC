/*
  Warnings:

  - You are about to drop the column `dosage` on the `prescribed_medicines` table. All the data in the column will be lost.
  - You are about to drop the column `duration` on the `prescribed_medicines` table. All the data in the column will be lost.
  - You are about to drop the column `instructions` on the `prescribed_medicines` table. All the data in the column will be lost.
  - Added the required column `form` to the `prescribed_medicines` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fullInstruction` to the `prescribed_medicines` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantityPerDose` to the `prescribed_medicines` table without a default value. This is not possible if the table is not empty.
  - Added the required column `route` to the `prescribed_medicines` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "prescribed_medicines" DROP COLUMN "dosage",
DROP COLUMN "duration",
DROP COLUMN "instructions",
ADD COLUMN     "durationInDays" INTEGER,
ADD COLUMN     "form" TEXT NOT NULL,
ADD COLUMN     "fullInstruction" TEXT NOT NULL,
ADD COLUMN     "quantityPerDose" INTEGER NOT NULL,
ADD COLUMN     "route" TEXT NOT NULL,
ADD COLUMN     "totalQuantity" TEXT;
