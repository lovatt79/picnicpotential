-- ============================================================
-- Add thumbnail images to service_sections
-- Used on homepage to show section cards with images
-- ============================================================

ALTER TABLE service_sections
  ADD COLUMN IF NOT EXISTS image_url TEXT,
  ADD COLUMN IF NOT EXISTS image_id UUID REFERENCES media(id) ON DELETE SET NULL;

-- Also add to seating_sections for consistency
ALTER TABLE seating_sections
  ADD COLUMN IF NOT EXISTS image_url TEXT,
  ADD COLUMN IF NOT EXISTS image_id UUID REFERENCES media(id) ON DELETE SET NULL;
