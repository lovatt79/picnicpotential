-- Seed page_heroes for pages that don't have entries yet
INSERT INTO page_heroes (page_key, title, description) VALUES
  ('about', 'About Picnic Potential', 'Creating memorable picnic and event experiences in Sonoma, Marin and the greater Bay Area.')
ON CONFLICT (page_key) DO NOTHING;

INSERT INTO page_heroes (page_key, title, description) VALUES
  ('testimonials', 'What Our Clients Say', 'We''re honored to create unforgettable experiences for every client.')
ON CONFLICT (page_key) DO NOTHING;

INSERT INTO page_heroes (page_key, title, description) VALUES
  ('faqs', 'Frequently Asked Questions', 'Find answers to common questions about our services, booking process, and more.')
ON CONFLICT (page_key) DO NOTHING;

-- About page content table (single row)
CREATE TABLE IF NOT EXISTS about_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  our_story_title VARCHAR(255) DEFAULT 'Our Story',
  our_story_text TEXT,
  features_title VARCHAR(255) DEFAULT 'What Sets Us Apart',
  service_area_title VARCHAR(255) DEFAULT 'Service Area',
  service_area_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- About features (like "What Sets Us Apart" cards)
CREATE TABLE IF NOT EXISTS about_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(100) DEFAULT 'check',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Disable RLS
ALTER TABLE about_content DISABLE ROW LEVEL SECURITY;
ALTER TABLE about_features DISABLE ROW LEVEL SECURITY;

-- Seed about_content with current hardcoded values
INSERT INTO about_content (our_story_title, our_story_text, features_title, service_area_title, service_area_text)
VALUES (
  'Our Story',
  'Picnic Potential was born from a love of bringing people together in beautiful outdoor settings. What started as a passion for creating memorable picnic experiences in Sonoma County wine country has grown into a full-service event planning company specializing in luxury picnics, elegant tablescapes, and bespoke celebrations.

We believe that every gathering deserves to be special. Whether it''s an intimate proposal, a corporate retreat, or a milestone birthday, we handle every detail so you can focus on making memories with the people who matter most.',
  'What Sets Us Apart',
  'Service Area',
  'Based in Sonoma County, we proudly serve the greater Bay Area including Petaluma, Santa Rosa, Healdsburg, Windsor, Napa Valley, Marin County, and beyond. We are happy to discuss locations outside of our standard service area.'
);

-- Seed about_features
INSERT INTO about_features (title, description, icon, sort_order) VALUES
  ('Curated Experiences', 'Every setup is thoughtfully designed with attention to detail, from color palettes to place settings.', 'palette', 0),
  ('Full-Service Setup', 'We handle everything — setup, styling, and cleanup — so you can simply enjoy the moment.', 'truck', 1),
  ('Local Partnerships', 'We partner with the best local vendors for charcuterie, florals, desserts, and more.', 'heart', 2);
