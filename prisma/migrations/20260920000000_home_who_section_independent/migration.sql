-- Home Who We Are section fields (independent from About page intro)
ALTER TABLE "SiteSetting" ADD COLUMN IF NOT EXISTS "homeWhoIntro" TEXT;
ALTER TABLE "SiteSetting" ADD COLUMN IF NOT EXISTS "homeWhoSecondary" TEXT;
ALTER TABLE "SiteSetting" ADD COLUMN IF NOT EXISTS "homeMission" TEXT;
ALTER TABLE "SiteSetting" ADD COLUMN IF NOT EXISTS "homeMissionSecondary" TEXT;
ALTER TABLE "SiteSetting" ADD COLUMN IF NOT EXISTS "homeVision" TEXT;
ALTER TABLE "SiteSetting" ADD COLUMN IF NOT EXISTS "homeVisionSecondary" TEXT;
ALTER TABLE "SiteSetting" ADD COLUMN IF NOT EXISTS "homeWhoImageUrl" TEXT;
ALTER TABLE "SiteSetting" ADD COLUMN IF NOT EXISTS "homeWhoImagePath" TEXT;
ALTER TABLE "SiteSetting" ADD COLUMN IF NOT EXISTS "homeMissionImageUrl" TEXT;
ALTER TABLE "SiteSetting" ADD COLUMN IF NOT EXISTS "homeMissionImagePath" TEXT;
ALTER TABLE "SiteSetting" ADD COLUMN IF NOT EXISTS "homeVisionImageUrl" TEXT;
ALTER TABLE "SiteSetting" ADD COLUMN IF NOT EXISTS "homeVisionImagePath" TEXT;

-- Seed home fields from existing About/shared values so the homepage keeps current content
UPDATE "SiteSetting"
SET
  "homeWhoIntro" = COALESCE("homeWhoIntro", "aboutIntro"),
  "homeWhoSecondary" = COALESCE("homeWhoSecondary", "philosophy"),
  "homeMission" = COALESCE("homeMission", "mission"),
  "homeMissionSecondary" = COALESCE("homeMissionSecondary", "differentiators"),
  "homeVision" = COALESCE("homeVision", "vision"),
  "homeVisionSecondary" = COALESCE("homeVisionSecondary", "philosophy"),
  "homeWhoImageUrl" = COALESCE("homeWhoImageUrl", "whoImageUrl"),
  "homeWhoImagePath" = COALESCE("homeWhoImagePath", "whoImagePath"),
  "homeMissionImageUrl" = COALESCE("homeMissionImageUrl", "missionImageUrl"),
  "homeMissionImagePath" = COALESCE("homeMissionImagePath", "missionImagePath"),
  "homeVisionImageUrl" = COALESCE("homeVisionImageUrl", "visionImageUrl"),
  "homeVisionImagePath" = COALESCE("homeVisionImagePath", "visionImagePath")
WHERE "id" = 'default';
