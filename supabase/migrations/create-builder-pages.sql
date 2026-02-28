-- Builder pages: user-created landing pages with block-based content
CREATE TABLE IF NOT EXISTS builder_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  meta_description TEXT,
  content JSONB DEFAULT '[]'::jsonb,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_builder_pages_slug ON builder_pages(slug);
CREATE INDEX IF NOT EXISTS idx_builder_pages_published ON builder_pages(is_published);

ALTER TABLE builder_pages DISABLE ROW LEVEL SECURITY;
