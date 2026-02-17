-- Service Page Content Tables
-- These tables allow full customization of individual service detail pages

-- Service page detail content
CREATE TABLE IF NOT EXISTS service_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID UNIQUE REFERENCES services(id) ON DELETE CASCADE,

  -- Hero section
  hero_subtitle TEXT,
  hero_image_id UUID REFERENCES media(id),

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
  icon VARCHAR(100), -- e.g., 'check', 'star', 'sparkles', 'truck', 'heart'
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

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_service_pages_service_id ON service_pages(service_id);
CREATE INDEX IF NOT EXISTS idx_service_features_page_id ON service_features(service_page_id);
CREATE INDEX IF NOT EXISTS idx_service_features_sort_order ON service_features(sort_order);
CREATE INDEX IF NOT EXISTS idx_service_gallery_page_id ON service_gallery_images(service_page_id);
CREATE INDEX IF NOT EXISTS idx_service_gallery_sort_order ON service_gallery_images(sort_order);

-- Disable RLS for now (enable with proper policies in production)
ALTER TABLE service_pages DISABLE ROW LEVEL SECURITY;
ALTER TABLE service_features DISABLE ROW LEVEL SECURITY;
ALTER TABLE service_gallery_images DISABLE ROW LEVEL SECURITY;

-- Add updated_at trigger for service_pages
CREATE OR REPLACE FUNCTION update_service_pages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER service_pages_updated_at
  BEFORE UPDATE ON service_pages
  FOR EACH ROW
  EXECUTE FUNCTION update_service_pages_updated_at();

-- Create default service_pages for existing services
INSERT INTO service_pages (service_id, intro_text)
SELECT
  id,
  'Transform your celebration into an unforgettable experience with our expertly crafted setups. We handle every detail so you can focus on making memories.'
FROM services
WHERE NOT EXISTS (
  SELECT 1 FROM service_pages WHERE service_pages.service_id = services.id
);

-- Add default features for each service page
INSERT INTO service_features (service_page_id, title, description, icon, sort_order)
SELECT
  sp.id,
  'Full Setup & Breakdown',
  'We handle all the details from start to finish',
  'check',
  1
FROM service_pages sp
WHERE NOT EXISTS (
  SELECT 1 FROM service_features WHERE service_features.service_page_id = sp.id
);

INSERT INTO service_features (service_page_id, title, description, icon, sort_order)
SELECT
  sp.id,
  'Curated Decor',
  'Thoughtfully designed elements to match your vision',
  'sparkles',
  2
FROM service_pages sp
WHERE (SELECT COUNT(*) FROM service_features WHERE service_features.service_page_id = sp.id) < 2;

INSERT INTO service_features (service_page_id, title, description, icon, sort_order)
SELECT
  sp.id,
  'Premium Quality',
  'High-end materials and attention to detail',
  'star',
  3
FROM service_pages sp
WHERE (SELECT COUNT(*) FROM service_features WHERE service_features.service_page_id = sp.id) < 3;
