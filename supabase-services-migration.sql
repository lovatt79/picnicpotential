-- Services table for homepage cards
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(100), -- e.g., 'cake', 'heart', 'briefcase', 'sparkles', 'camera', 'utensils'
  image_id UUID REFERENCES media(id) ON DELETE SET NULL,
  slug VARCHAR(255) UNIQUE NOT NULL, -- URL-friendly identifier
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Service detail pages
CREATE TABLE IF NOT EXISTS service_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID REFERENCES services(id) ON DELETE CASCADE,
  hero_title VARCHAR(255),
  hero_subtitle TEXT,
  hero_image_id UUID REFERENCES media(id) ON DELETE SET NULL,
  intro_text TEXT,

  -- Features section
  features_title VARCHAR(255) DEFAULT 'What We Offer',
  features_description TEXT,

  -- Gallery section
  gallery_title VARCHAR(255) DEFAULT 'Gallery',
  gallery_description TEXT,

  -- CTA section
  cta_title VARCHAR(255) DEFAULT 'Ready to Plan Your Event?',
  cta_description TEXT,
  cta_button_text VARCHAR(100) DEFAULT 'Get in Touch',
  cta_button_link VARCHAR(500) DEFAULT '/contact',

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Service page features (bullet points/features for each service)
CREATE TABLE IF NOT EXISTS service_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_page_id UUID REFERENCES service_pages(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(100),
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Service gallery images
CREATE TABLE IF NOT EXISTS service_gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_page_id UUID REFERENCES service_pages(id) ON DELETE CASCADE,
  image_id UUID REFERENCES media(id) ON DELETE CASCADE,
  caption TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default services (matching current homepage)
INSERT INTO services (title, description, icon, slug, display_order) VALUES
  ('Birthday Picnics', 'Celebrate your special day with a beautifully curated outdoor experience', 'cake', 'birthday-picnics', 1),
  ('Proposal & Engagement', 'Create an unforgettable moment with our romantic picnic setups', 'heart', 'proposals', 2),
  ('Corporate Events', 'Elevate your team building with unique outdoor experiences', 'briefcase', 'corporate-events', 3),
  ('Luxury Rentals', 'Premium picnic equipment and decor for your DIY events', 'sparkles', 'luxury-rentals', 4),
  ('Photoshoots', 'Picture-perfect setups for your photography sessions', 'camera', 'photoshoots', 5),
  ('Custom Tablescapes', 'Bespoke table settings for any occasion', 'utensils', 'tablescapes', 6)
ON CONFLICT (slug) DO NOTHING;

-- Create service pages for each service
INSERT INTO service_pages (service_id, hero_title, hero_subtitle, intro_text)
SELECT
  id,
  title,
  description,
  'Transform your celebration into an unforgettable experience with our expertly crafted picnic setups. We handle every detail so you can focus on making memories.'
FROM services
ON CONFLICT DO NOTHING;

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_service_pages_updated_at BEFORE UPDATE ON service_pages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Disable RLS for now (we'll enable with proper policies later)
ALTER TABLE services DISABLE ROW LEVEL SECURITY;
ALTER TABLE service_pages DISABLE ROW LEVEL SECURITY;
ALTER TABLE service_features DISABLE ROW LEVEL SECURITY;
ALTER TABLE service_gallery DISABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_services_slug ON services(slug);
CREATE INDEX IF NOT EXISTS idx_services_display_order ON services(display_order);
CREATE INDEX IF NOT EXISTS idx_service_pages_service_id ON service_pages(service_id);
CREATE INDEX IF NOT EXISTS idx_service_features_service_page_id ON service_features(service_page_id);
CREATE INDEX IF NOT EXISTS idx_service_gallery_service_page_id ON service_gallery(service_page_id);
