/*
  Warnings:

  - A unique constraint covering the columns `[id,step]` on the table `WorkshopStep` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "WorkshopStep_id_step_key" ON "WorkshopStep"("id", "step");
