-- Navigation items for dynamic menu management
CREATE TABLE IF NOT EXISTS navigation_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label VARCHAR(255) NOT NULL,
  href VARCHAR(500) NOT NULL,
  parent_id UUID REFERENCES navigation_items(id) ON DELETE CASCADE,
  sort_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  open_in_new_tab BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_navigation_items_sort ON navigation_items(sort_order);
CREATE INDEX IF NOT EXISTS idx_navigation_items_parent ON navigation_items(parent_id);

ALTER TABLE navigation_items DISABLE ROW LEVEL SECURITY;

-- Seed with current navigation links
INSERT INTO navigation_items (label, href, sort_order, is_published) VALUES
  ('Home', '/', 0, true),
  ('About', '/about', 1, true),
  ('Services', '/services', 2, true),
  ('Seating Styles', '/seating', 3, true),
  ('Partners', '/partners', 4, true),
  ('New in 2026', '/new-2026', 5, true),
  ('FAQs', '/faqs', 6, true),
  ('Send a Hint', '/send-a-hint', 7, true);
