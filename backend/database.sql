-- SKYNZ Database Schema

-- Creators table
CREATE TABLE IF NOT EXISTS creators (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  handle VARCHAR(255) UNIQUE NOT NULL,
  bio TEXT,
  avatar_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pages table
CREATE TABLE IF NOT EXISTS pages (
  id UUID PRIMARY KEY,
  creator_id UUID NOT NULL REFERENCES creators(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  handle VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  platforms JSONB DEFAULT '[]',
  platform_urls JSONB NOT NULL DEFAULT '{}',
  embed_url VARCHAR(500),
  affiliate_link VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Analytics table
CREATE TABLE IF NOT EXISTS analytics (
  id UUID PRIMARY KEY,
  page_id UUID NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  creator_id UUID NOT NULL REFERENCES creators(id) ON DELETE CASCADE,
  event_type VARCHAR(50),
  visitor_count INT DEFAULT 1,
  watch_time INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Chat messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY,
  page_handle VARCHAR(255) NOT NULL,
  username VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Badges (NFT) table
CREATE TABLE IF NOT EXISTS badges (
  id UUID PRIMARY KEY,
  creator_id UUID NOT NULL REFERENCES creators(id) ON DELETE CASCADE,
  badge_type VARCHAR(100) NOT NULL,
  mint_address VARCHAR(255),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Streaming integrations table
CREATE TABLE IF NOT EXISTS streaming_integrations (
  id UUID PRIMARY KEY,
  creator_id UUID NOT NULL REFERENCES creators(id) ON DELETE CASCADE,
  platform VARCHAR(100) NOT NULL,
  api_key VARCHAR(500) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_creators_email ON creators(email);
CREATE INDEX IF NOT EXISTS idx_creators_handle ON creators(handle);
CREATE INDEX IF NOT EXISTS idx_pages_creator_id ON pages(creator_id);
CREATE INDEX IF NOT EXISTS idx_pages_handle ON pages(handle);
CREATE INDEX IF NOT EXISTS idx_analytics_page_id ON analytics(page_id);
CREATE INDEX IF NOT EXISTS idx_analytics_creator_id ON analytics(creator_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_page_handle ON chat_messages(page_handle);
CREATE INDEX IF NOT EXISTS idx_badges_creator_id ON badges(creator_id);
CREATE INDEX IF NOT EXISTS idx_streaming_integrations_creator_id ON streaming_integrations(creator_id);
