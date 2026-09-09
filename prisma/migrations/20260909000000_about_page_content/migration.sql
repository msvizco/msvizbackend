-- AlterTable
ALTER TABLE "SiteSetting" ADD COLUMN IF NOT EXISTS "aboutHeadline" TEXT;

-- CreateTable
CREATE TABLE IF NOT EXISTS "AboutFeature" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "iconUrl" TEXT,
    "iconPath" TEXT,
    "linkUrl" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "AboutFeature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "TeamMember" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "imageUrl" TEXT,
    "imagePath" TEXT,
    "rating" INTEGER NOT NULL DEFAULT 5,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "TeamMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "AboutStory" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "body" TEXT NOT NULL,
    "imageUrl" TEXT,
    "imagePath" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "AboutStory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "AboutFeature_active_idx" ON "AboutFeature"("active");
CREATE INDEX IF NOT EXISTS "AboutFeature_displayOrder_idx" ON "AboutFeature"("displayOrder");
CREATE INDEX IF NOT EXISTS "TeamMember_active_idx" ON "TeamMember"("active");
CREATE INDEX IF NOT EXISTS "TeamMember_displayOrder_idx" ON "TeamMember"("displayOrder");
CREATE INDEX IF NOT EXISTS "AboutStory_active_idx" ON "AboutStory"("active");
CREATE INDEX IF NOT EXISTS "AboutStory_displayOrder_idx" ON "AboutStory"("displayOrder");
