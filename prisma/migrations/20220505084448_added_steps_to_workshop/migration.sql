/*
  Warnings:

  - You are about to drop the column `workshopTemplateId` on the `WorkshopStep` table. All the data in the column will be lost.
  - Added the required column `workshopId` to the `WorkshopStep` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `WorkshopTemplate` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "WorkshopPrivacyLevel" AS ENUM ('FULL_VISIBLE', 'VISIBLE_WITHOUT_USER_INFORMATION', 'PRIVATE');

-- DropForeignKey
ALTER TABLE "WorkshopStep" DROP CONSTRAINT "WorkshopStep_workshopTemplateId_fkey";

-- AlterTable
ALTER TABLE "Workshop" ADD COLUMN     "privacyLevel" "WorkshopPrivacyLevel" NOT NULL DEFAULT E'FULL_VISIBLE';

-- AlterTable
ALTER TABLE "WorkshopStep" DROP COLUMN "workshopTemplateId",
ADD COLUMN     "workshopId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "WorkshopTemplate" ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "WorkshopTemplateStep" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "durationSeconds" INTEGER NOT NULL,
    "step" INTEGER NOT NULL,
    "data" JSONB NOT NULL DEFAULT '{}',
    "workshopTemplateId" TEXT,

    CONSTRAINT "WorkshopTemplateStep_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WorkshopTemplate" ADD CONSTRAINT "WorkshopTemplate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkshopTemplateStep" ADD CONSTRAINT "WorkshopTemplateStep_workshopTemplateId_fkey" FOREIGN KEY ("workshopTemplateId") REFERENCES "WorkshopTemplate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkshopStep" ADD CONSTRAINT "WorkshopStep_workshopId_fkey" FOREIGN KEY ("workshopId") REFERENCES "Workshop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
