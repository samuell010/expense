/*
  Warnings:

  - You are about to drop the column `tripId` on the `DailyAllowance` table. All the data in the column will be lost.
  - You are about to drop the column `route` on the `KilometerAllowance` table. All the data in the column will be lost.
  - You are about to drop the column `sum` on the `KilometerAllowance` table. All the data in the column will be lost.
  - You are about to drop the column `tripId` on the `KilometerAllowance` table. All the data in the column will be lost.
  - You are about to drop the column `overallSummary` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `reportDate` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `totalKilometerAllowance` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `totalOtherAllowance` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `tripId` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the `Trip` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `description` to the `DailyAllowance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reportId` to the `DailyAllowance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endLat` to the `KilometerAllowance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endLng` to the `KilometerAllowance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endPoint` to the `KilometerAllowance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reportId` to the `KilometerAllowance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startLat` to the `KilometerAllowance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startLng` to the `KilometerAllowance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startPoint` to the `KilometerAllowance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalCost` to the `KilometerAllowance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endDate` to the `Report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `Report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Report` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('DRAFT', 'COMPLETED', 'DELETED');

-- DropForeignKey
ALTER TABLE "DailyAllowance" DROP CONSTRAINT "DailyAllowance_tripId_fkey";

-- DropForeignKey
ALTER TABLE "KilometerAllowance" DROP CONSTRAINT "KilometerAllowance_tripId_fkey";

-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_tripId_fkey";

-- DropIndex
DROP INDEX "Report_tripId_key";

-- AlterTable
ALTER TABLE "DailyAllowance" DROP COLUMN "tripId",
ADD COLUMN     "description" VARCHAR(150) NOT NULL,
ADD COLUMN     "reportId" INTEGER NOT NULL,
ADD COLUMN     "travelingByShipOrPlane" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "startDate" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "endDate" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "KilometerAllowance" DROP COLUMN "route",
DROP COLUMN "sum",
DROP COLUMN "tripId",
ADD COLUMN     "endLat" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "endLng" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "endPoint" TEXT NOT NULL,
ADD COLUMN     "reportId" INTEGER NOT NULL,
ADD COLUMN     "startLat" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "startLng" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "startPoint" TEXT NOT NULL,
ADD COLUMN     "totalCost" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "startDate" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "endDate" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Report" DROP COLUMN "overallSummary",
DROP COLUMN "reportDate",
DROP COLUMN "totalKilometerAllowance",
DROP COLUMN "totalOtherAllowance",
DROP COLUMN "tripId",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "description" VARCHAR(150) NOT NULL,
ADD COLUMN     "endDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "status" "ReportStatus" NOT NULL DEFAULT 'DRAFT',
ADD COLUMN     "title" VARCHAR(150) NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "Trip";

-- CreateTable
CREATE TABLE "OtherExpense" (
    "id" SERIAL NOT NULL,
    "type" VARCHAR(30) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "country" VARCHAR(30) NOT NULL,
    "vat" DOUBLE PRECISION NOT NULL,
    "sum" DOUBLE PRECISION NOT NULL,
    "description" VARCHAR(150) NOT NULL,
    "comment" VARCHAR(300) NOT NULL,
    "reportId" INTEGER NOT NULL,

    CONSTRAINT "OtherExpense_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attachment" (
    "id" SERIAL NOT NULL,
    "fileName" VARCHAR(300) NOT NULL,
    "url" VARCHAR(2000) NOT NULL,
    "urlExpiration" TIMESTAMP(3),
    "otherExpenseId" INTEGER NOT NULL,

    CONSTRAINT "Attachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Location" (
    "id" SERIAL NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "address" TEXT NOT NULL,
    "settingId" INTEGER NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Setting" (
    "id" SERIAL NOT NULL,
    "currency" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Setting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Attachment_url_key" ON "Attachment"("url");

-- CreateIndex
CREATE UNIQUE INDEX "Setting_userId_key" ON "Setting"("userId");

-- AddForeignKey
ALTER TABLE "KilometerAllowance" ADD CONSTRAINT "KilometerAllowance_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyAllowance" ADD CONSTRAINT "DailyAllowance_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OtherExpense" ADD CONSTRAINT "OtherExpense_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_otherExpenseId_fkey" FOREIGN KEY ("otherExpenseId") REFERENCES "OtherExpense"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_settingId_fkey" FOREIGN KEY ("settingId") REFERENCES "Setting"("id") ON DELETE CASCADE ON UPDATE CASCADE;
