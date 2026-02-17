-- Service page detail content tables
CREATE TABLE IF NOT EXISTS service_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID UNIQUE REFERENCES services(id) ON DELETE CASCADE,

  -- Hero section
  hero_subtitle TEXT,
  hero_image_id UUID REFERENCES media(id) ON DELETE SET NULL,

  -- Intro section
  intro_text TEXT,

  -- Features/What's Included section
  features_section_title VARCHAR(255) DEFAULT 'What''s Included',
  features_section_description TEXT,

  -- Gallery section
  gallery_section_title VARCHAR(255) DEFAULT 'Gallery',
  gallery_section_description TEXT,

  -- CTA section
  cta_section_title VARCHAR(255) DEFAULT 'Ready to Get Started?',
  cta_section_description TEXT,
  cta_button_text VARCHAR(100) DEFAULT 'Request This Service',
  cta_button_link VARCHAR(500) DEFAULT '/request',

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Individual features for "What's Included" section
CREATE TABLE IF NOT EXISTS service_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_page_id UUID REFERENCES service_pages(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(100), -- e.g., 'check', 'star', 'sparkles'
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Gallery images for service pages
CREATE TABLE IF NOT EXISTS service_gallery_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_page_id UUID REFERENCES service_pages(id) ON DELETE CASCADE,
  image_id UUID REFERENCES media(id) ON DELETE CASCADE,
  caption TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_service_pages_service_id ON service_pages(service_id);
CREATE INDEX IF NOT EXISTS idx_service_pages_hero_image ON service_pages(hero_image_id);
CREATE INDEX IF NOT EXISTS idx_service_features_page_id ON service_features(service_page_id);
CREATE INDEX IF NOT EXISTS idx_service_features_sort ON service_features(sort_order);
CREATE INDEX IF NOT EXISTS idx_service_gallery_page_id ON service_gallery_images(service_page_id);
CREATE INDEX IF NOT EXISTS idx_service_gallery_image_id ON service_gallery_images(image_id);
CREATE INDEX IF NOT EXISTS idx_service_gallery_sort ON service_gallery_images(sort_order);

-- Disable RLS for now (enable with proper policies later)
ALTER TABLE service_pages DISABLE ROW LEVEL SECURITY;
ALTER TABLE service_features DISABLE ROW LEVEL SECURITY;
ALTER TABLE service_gallery_images DISABLE ROW LEVEL SECURITY;
