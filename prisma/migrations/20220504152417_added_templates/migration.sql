-- AlterTable
ALTER TABLE "Workshop" ADD COLUMN     "workshopTemplateId" TEXT;

-- CreateTable
CREATE TABLE "WorkshopTemplate" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "public" BOOLEAN NOT NULL,

    CONSTRAINT "WorkshopTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkshopStep" (
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

    CONSTRAINT "WorkshopStep_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WorkshopStep" ADD CONSTRAINT "WorkshopStep_workshopTemplateId_fkey" FOREIGN KEY ("workshopTemplateId") REFERENCES "WorkshopTemplate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workshop" ADD CONSTRAINT "Workshop_workshopTemplateId_fkey" FOREIGN KEY ("workshopTemplateId") REFERENCES "WorkshopTemplate"("id") ON DELETE SET NULL ON UPDATE CASCADE;
