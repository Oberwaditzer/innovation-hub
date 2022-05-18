/*
  Warnings:

  - You are about to drop the column `data` on the `WorkshopStep` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "WorkshopStep" DROP COLUMN "data";

-- CreateTable
CREATE TABLE "WorkshopStepData" (
    "id" TEXT NOT NULL,
    "createTime" TIMESTAMP(3) NOT NULL,
    "timeInWorkshop" INTEGER NOT NULL,
    "data" JSONB NOT NULL,
    "workshopStepId" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "WorkshopStepData_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WorkshopStepData" ADD CONSTRAINT "WorkshopStepData_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkshopStepData" ADD CONSTRAINT "WorkshopStepData_workshopStepId_fkey" FOREIGN KEY ("workshopStepId") REFERENCES "WorkshopStep"("id") ON DELETE SET NULL ON UPDATE CASCADE;
