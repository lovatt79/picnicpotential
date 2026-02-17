-- Migration: Add page content management and media library
-- Run this in your Supabase SQL Editor after the initial schema

-- ============================================================================
-- MEDIA LIBRARY
-- ============================================================================

CREATE TABLE IF NOT EXISTS media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  url TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size_bytes INTEGER NOT NULL,
  width INTEGER,
  height INTEGER,
  alt_text TEXT,
  caption TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_media_created_at ON media(created_at DESC);
CREATE INDEX idx_media_mime_type ON media(mime_type);

-- ============================================================================
-- PAGE CONTENT MANAGEMENT
-- ============================================================================

-- Homepage content
CREATE TABLE IF NOT EXISTS homepage_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hero_title TEXT NOT NULL DEFAULT 'Picnic Potential',
  hero_subtitle TEXT NOT NULL DEFAULT 'A truly unique picnic and event experience',
  hero_description TEXT NOT NULL DEFAULT 'Creating memorable moments in Sonoma County wine country',
  hero_cta_text TEXT NOT NULL DEFAULT 'Book Your Experience',
  hero_cta_link TEXT NOT NULL DEFAULT '/request',
  hero_image_id UUID REFERENCES media(id) ON DELETE SET NULL,
  hero_background_color TEXT DEFAULT '#F5F1E8',

  -- Featured section
  featured_title TEXT DEFAULT 'Why Choose Picnic Potential',
  featured_subtitle TEXT,

  -- About preview section
  about_preview_title TEXT DEFAULT 'About Us',
  about_preview_text TEXT,
  about_preview_image_id UUID REFERENCES media(id) ON DELETE SET NULL,

  -- CTA section
  cta_title TEXT DEFAULT 'Ready to Create Your Perfect Picnic?',
  cta_subtitle TEXT DEFAULT 'Let us help you plan an unforgettable experience',
  cta_button_text TEXT DEFAULT 'Get Started',
  cta_button_link TEXT DEFAULT '/request',
  cta_background_color TEXT DEFAULT '#2C2C2C',

  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default homepage content
INSERT INTO homepage_content (id, hero_title, hero_subtitle, hero_description)
VALUES (gen_random_uuid(), 'Picnic Potential', 'Luxury Picnics & Events in Sonoma County', 'A truly unique picnic and event experience that comes in a variety of styles that fit any occasion')
ON CONFLICT DO NOTHING;

-- About page content
CREATE TABLE IF NOT EXISTS about_page_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_title TEXT NOT NULL DEFAULT 'About Us',
  hero_image_id UUID REFERENCES media(id) ON DELETE SET NULL,

  -- Main content sections
  intro_title TEXT DEFAULT 'Our Story',
  intro_text TEXT,

  mission_title TEXT DEFAULT 'Our Mission',
  mission_text TEXT,

  values_title TEXT DEFAULT 'Our Values',
  values_text TEXT,

  team_title TEXT DEFAULT 'Meet the Team',
  team_subtitle TEXT,

  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default about content
INSERT INTO about_page_content (id, page_title)
VALUES (gen_random_uuid(), 'About Us')
ON CONFLICT DO NOTHING;

-- Team members
CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  bio TEXT,
  photo_id UUID REFERENCES media(id) ON DELETE SET NULL,
  email TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_team_members_order ON team_members(display_order) WHERE is_active = true;

-- Other pages content (flexible key-value storage)
CREATE TABLE IF NOT EXISTS page_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_slug TEXT NOT NULL, -- 'new-2026', 'send-a-hint', etc.
  section_key TEXT NOT NULL, -- 'hero', 'main', 'features', etc.
  content_type TEXT NOT NULL, -- 'text', 'html', 'image', 'json'
  content_text TEXT,
  content_json JSONB,
  media_id UUID REFERENCES media(id) ON DELETE SET NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(page_slug, section_key)
);

CREATE INDEX idx_page_content_slug ON page_content(page_slug);
CREATE INDEX idx_page_content_order ON page_content(page_slug, display_order);

-- ============================================================================
-- FEATURE CARDS (for homepage features)
-- ============================================================================

CREATE TABLE IF NOT EXISTS feature_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon_name TEXT, -- For storing icon identifier
  icon_image_id UUID REFERENCES media(id) ON DELETE SET NULL,
  link_url TEXT,
  link_text TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_feature_cards_order ON feature_cards(display_order) WHERE is_active = true;

-- Insert default features
INSERT INTO feature_cards (title, description, icon_name, display_order) VALUES
('Custom Designs', 'Each picnic is uniquely designed to match your vision and occasion', 'palette', 1),
('Premium Quality', 'High-end rentals, fresh local ingredients, and attention to every detail', 'star', 2),
('Full Service', 'We handle setup, breakdown, and everything in between', 'check', 3),
('Flexible Locations', 'Beautiful setups at wineries, parks, beaches, or your chosen venue', 'map', 4)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- GALLERY / PHOTO ALBUMS
-- ============================================================================

CREATE TABLE IF NOT EXISTS photo_albums (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  slug TEXT UNIQUE NOT NULL,
  cover_image_id UUID REFERENCES media(id) ON DELETE SET NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_photo_albums_order ON photo_albums(display_order) WHERE is_active = true;

CREATE TABLE IF NOT EXISTS album_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  album_id UUID NOT NULL REFERENCES photo_albums(id) ON DELETE CASCADE,
  media_id UUID NOT NULL REFERENCES media(id) ON DELETE CASCADE,
  caption TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_album_photos_album ON album_photos(album_id, display_order);

-- ============================================================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_homepage_content_updated_at BEFORE UPDATE ON homepage_content
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_about_page_content_updated_at BEFORE UPDATE ON about_page_content
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_team_members_updated_at BEFORE UPDATE ON team_members
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_page_content_updated_at BEFORE UPDATE ON page_content
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_feature_cards_updated_at BEFORE UPDATE ON feature_cards
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_photo_albums_updated_at BEFORE UPDATE ON photo_albums
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_media_updated_at BEFORE UPDATE ON media
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- RLS POLICIES
-- ============================================================================

-- Media
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public media read access" ON media FOR SELECT USING (true);
CREATE POLICY "Authenticated users can upload media" ON media FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update media" ON media FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete media" ON media FOR DELETE USING (auth.role() = 'authenticated');

-- Homepage content
ALTER TABLE homepage_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public homepage read access" ON homepage_content FOR SELECT USING (true);
CREATE POLICY "Authenticated users can update homepage" ON homepage_content FOR UPDATE USING (auth.role() = 'authenticated');

-- About page content
ALTER TABLE about_page_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public about page read access" ON about_page_content FOR SELECT USING (true);
CREATE POLICY "Authenticated users can update about page" ON about_page_content FOR UPDATE USING (auth.role() = 'authenticated');

-- Team members
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public team members read access" ON team_members FOR SELECT USING (is_active = true);
CREATE POLICY "Authenticated users full access to team members" ON team_members FOR ALL USING (auth.role() = 'authenticated');

-- Page content
ALTER TABLE page_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public page content read access" ON page_content FOR SELECT USING (true);
CREATE POLICY "Authenticated users full access to page content" ON page_content FOR ALL USING (auth.role() = 'authenticated');

-- Feature cards
ALTER TABLE feature_cards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public feature cards read access" ON feature_cards FOR SELECT USING (is_active = true);
CREATE POLICY "Authenticated users full access to feature cards" ON feature_cards FOR ALL USING (auth.role() = 'authenticated');

-- Photo albums
ALTER TABLE photo_albums ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public photo albums read access" ON photo_albums FOR SELECT USING (is_active = true);
CREATE POLICY "Authenticated users full access to photo albums" ON photo_albums FOR ALL USING (auth.role() = 'authenticated');

-- Album photos
ALTER TABLE album_photos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public album photos read access" ON album_photos FOR SELECT USING (true);
CREATE POLICY "Authenticated users full access to album photos" ON album_photos FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================================
-- STORAGE BUCKET FOR IMAGES
-- ============================================================================

-- Note: This needs to be run in Supabase dashboard Storage section or via API
-- Create a 'images' bucket with public access
-- Alternatively, use Supabase dashboard: Storage → New Bucket → Name: images, Public: true
