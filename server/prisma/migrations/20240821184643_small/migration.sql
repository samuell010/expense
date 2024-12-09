/*
  Warnings:

  - The `route` column on the `KilometerAllowance` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `Allowance` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Allowance" DROP CONSTRAINT "Allowance_tripId_fkey";

-- AlterTable
ALTER TABLE "KilometerAllowance" DROP COLUMN "route",
ADD COLUMN     "route" TEXT[];

-- DropTable
DROP TABLE "Allowance";

-- CreateTable
CREATE TABLE "DailyAllowance" (
    "id" SERIAL NOT NULL,
    "totalAllowances" INTEGER NOT NULL,
    "freeMeals" INTEGER NOT NULL,
    "country" VARCHAR(30) NOT NULL,
    "over_5_km" BOOLEAN NOT NULL DEFAULT false,
    "over_15_km" BOOLEAN NOT NULL DEFAULT false,
    "startDate" DATE NOT NULL,
    "endDate" DATE NOT NULL,
    "tripId" INTEGER NOT NULL,

    CONSTRAINT "DailyAllowance_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DailyAllowance" ADD CONSTRAINT "DailyAllowance_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;
