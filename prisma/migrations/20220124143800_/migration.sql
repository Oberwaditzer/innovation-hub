/*
  Warnings:

  - You are about to drop the column `owner` on the `UsersOnTeams` table. All the data in the column will be lost.
  - Added the required column `admin` to the `UsersOnTeams` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UsersOnTeams" DROP COLUMN "owner",
ADD COLUMN     "admin" BOOLEAN NOT NULL;

-- CreateTable
CREATE TABLE "UsersOnWorkshops" (
    "userId" TEXT NOT NULL,
    "workshopId" TEXT NOT NULL,
    "admin" BOOLEAN NOT NULL,

    CONSTRAINT "UsersOnWorkshops_pkey" PRIMARY KEY ("userId","workshopId")
);

-- CreateTable
CREATE TABLE "_TeamToWorkshop" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_TeamToWorkshop_AB_unique" ON "_TeamToWorkshop"("A", "B");

-- CreateIndex
CREATE INDEX "_TeamToWorkshop_B_index" ON "_TeamToWorkshop"("B");

-- AddForeignKey
ALTER TABLE "UsersOnWorkshops" ADD CONSTRAINT "UsersOnWorkshops_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersOnWorkshops" ADD CONSTRAINT "UsersOnWorkshops_workshopId_fkey" FOREIGN KEY ("workshopId") REFERENCES "Workshop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TeamToWorkshop" ADD FOREIGN KEY ("A") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TeamToWorkshop" ADD FOREIGN KEY ("B") REFERENCES "Workshop"("id") ON DELETE CASCADE ON UPDATE CASCADE;
