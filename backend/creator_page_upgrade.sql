-- Run once against the existing SKYNZ PostgreSQL database before starting the upgraded backend.
-- Additive migration: preserves existing creator pages.
ALTER TABLE pages ADD COLUMN IF NOT EXISTS second_embed_url VARCHAR(500) DEFAULT '';
ALTER TABLE pages ADD COLUMN IF NOT EXISTS social_links JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE pages ADD COLUMN IF NOT EXISTS theme VARCHAR(20) NOT NULL DEFAULT 'emerald';
