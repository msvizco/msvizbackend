-- AlterTable
ALTER TABLE "SiteSetting" ADD COLUMN IF NOT EXISTS "heroImageUrl" TEXT;
ALTER TABLE "SiteSetting" ADD COLUMN IF NOT EXISTS "heroImagePath" TEXT;
