-- Home CTA section background image
ALTER TABLE "SiteSetting" ADD COLUMN IF NOT EXISTS "ctaBackgroundImageUrl" TEXT;
ALTER TABLE "SiteSetting" ADD COLUMN IF NOT EXISTS "ctaBackgroundImagePath" TEXT;
