-- Collection sections: named groups within a collection page
CREATE TABLE IF NOT EXISTS collection_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_page_id UUID NOT NULL REFERENCES collection_pages(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_collection_sections_page ON collection_sections(collection_page_id);
CREATE INDEX IF NOT EXISTS idx_collection_sections_sort ON collection_sections(sort_order);

ALTER TABLE collection_sections DISABLE ROW LEVEL SECURITY;

-- Add section_id to collection_page_items (nullable = uncategorized)
ALTER TABLE collection_page_items
  ADD COLUMN IF NOT EXISTS section_id UUID REFERENCES collection_sections(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_collection_page_items_section ON collection_page_items(section_id);
