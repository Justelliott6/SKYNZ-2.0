-- Run once against an existing SKYNZ database before starting the updated API.
ALTER TABLE pages ADD COLUMN IF NOT EXISTS platform_urls JSONB NOT NULL DEFAULT '{}'::jsonb;
