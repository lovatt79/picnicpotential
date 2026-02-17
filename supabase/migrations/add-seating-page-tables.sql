-- Seating page detail content tables
CREATE TABLE IF NOT EXISTS seating_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seating_option_id UUID UNIQUE REFERENCES seating_options(id) ON DELETE CASCADE,

  -- Hero section
  hero_subtitle TEXT,

  -- Features/Details section
  features_text TEXT,
  pricing_info TEXT,

  -- Gallery section
  gallery_section_title VARCHAR(255) DEFAULT 'Gallery',
  gallery_section_description TEXT,

  -- CTA section
  cta_title VARCHAR(255) DEFAULT 'Interested in This Seating Style?',
  cta_description TEXT,
  cta_button_text VARCHAR(100) DEFAULT 'Get a Quote',
  cta_button_link VARCHAR(500) DEFAULT '/request',

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Gallery images for seating pages
CREATE TABLE IF NOT EXISTS seating_gallery_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seating_page_id UUID REFERENCES seating_pages(id) ON DELETE CASCADE,
  image_id UUID REFERENCES media(id) ON DELETE CASCADE,
  caption TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_seating_pages_seating_option ON seating_pages(seating_option_id);
CREATE INDEX IF NOT EXISTS idx_seating_gallery_page_id ON seating_gallery_images(seating_page_id);
CREATE INDEX IF NOT EXISTS idx_seating_gallery_image_id ON seating_gallery_images(image_id);
CREATE INDEX IF NOT EXISTS idx_seating_gallery_sort ON seating_gallery_images(sort_order);

-- Disable RLS for now
ALTER TABLE seating_pages DISABLE ROW LEVEL SECURITY;
ALTER TABLE seating_gallery_images DISABLE ROW LEVEL SECURITY;
