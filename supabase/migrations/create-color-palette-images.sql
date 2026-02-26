-- Color palette image gallery
CREATE TABLE IF NOT EXISTS color_palette_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_id UUID NOT NULL REFERENCES media(id) ON DELETE CASCADE,
  sort_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_color_palette_images_sort ON color_palette_images(sort_order);
CREATE INDEX IF NOT EXISTS idx_color_palette_images_image ON color_palette_images(image_id);

ALTER TABLE color_palette_images DISABLE ROW LEVEL SECURITY;
