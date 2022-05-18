/*
  Warnings:

  - Made the column `workshopStepId` on table `WorkshopStepData` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "WorkshopStepData" DROP CONSTRAINT "WorkshopStepData_workshopStepId_fkey";

-- AlterTable
ALTER TABLE "WorkshopStepData" ALTER COLUMN "workshopStepId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "WorkshopStepData" ADD CONSTRAINT "WorkshopStepData_workshopStepId_fkey" FOREIGN KEY ("workshopStepId") REFERENCES "WorkshopStep"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
