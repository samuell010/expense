/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Profile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_userId_fkey";

-- DropTable
DROP TABLE "Post";

-- DropTable
DROP TABLE "Profile";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "Trip" (
    "id" SERIAL NOT NULL,
    "description" VARCHAR(150) NOT NULL,
    "transport" TEXT[],
    "startDate" DATE NOT NULL,
    "endDate" DATE NOT NULL,

    CONSTRAINT "Trip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KilometerAllowance" (
    "id" SERIAL NOT NULL,
    "description" VARCHAR(150) NOT NULL,
    "vehicleInfo" VARCHAR(50) NOT NULL,
    "passengers" INTEGER NOT NULL,
    "route" VARCHAR(100) NOT NULL,
    "distance" DOUBLE PRECISION NOT NULL,
    "sum" DOUBLE PRECISION NOT NULL,
    "startDate" DATE NOT NULL,
    "endDate" DATE NOT NULL,
    "passengerNames" TEXT[],
    "tripId" INTEGER NOT NULL,

    CONSTRAINT "KilometerAllowance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Allowance" (
    "id" SERIAL NOT NULL,
    "totalAllowances" INTEGER NOT NULL,
    "freeMeals" INTEGER NOT NULL,
    "country" VARCHAR(30) NOT NULL,
    "startDate" DATE NOT NULL,
    "endDate" DATE NOT NULL,
    "tripId" INTEGER NOT NULL,

    CONSTRAINT "Allowance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" SERIAL NOT NULL,
    "tripId" INTEGER NOT NULL,
    "reportDate" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "totalKilometerAllowance" DOUBLE PRECISION NOT NULL,
    "totalOtherAllowance" DOUBLE PRECISION NOT NULL,
    "overallSummary" TEXT NOT NULL,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Report_tripId_key" ON "Report"("tripId");

-- AddForeignKey
ALTER TABLE "KilometerAllowance" ADD CONSTRAINT "KilometerAllowance_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Allowance" ADD CONSTRAINT "Allowance_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;
