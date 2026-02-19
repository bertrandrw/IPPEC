-- AlterTable
ALTER TABLE "pharmacies" ADD COLUMN     "authorizedPharmacistId" TEXT,
ADD COLUMN     "companyCode" TEXT,
ADD COLUMN     "contactEmail" TEXT,
ADD COLUMN     "contactPhone" TEXT,
ADD COLUMN     "licenseExpiryDate" TIMESTAMP(3),
ADD COLUMN     "managingDirector" TEXT;
