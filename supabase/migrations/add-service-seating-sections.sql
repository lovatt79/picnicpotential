-- ============================================================
-- Service & Seating Sections
-- Grouping containers for organizing services and seating options
-- ============================================================

-- Service sections
CREATE TABLE IF NOT EXISTS service_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seating sections
CREATE TABLE IF NOT EXISTS seating_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add section_id to services (items with NULL section_id are "uncategorized")
ALTER TABLE services
  ADD COLUMN IF NOT EXISTS section_id UUID REFERENCES service_sections(id) ON DELETE SET NULL;

-- Add external_url to services (when set, card links externally instead of to /services/[slug])
ALTER TABLE services
  ADD COLUMN IF NOT EXISTS external_url TEXT;

-- Add section_id to seating_options
ALTER TABLE seating_options
  ADD COLUMN IF NOT EXISTS section_id UUID REFERENCES seating_sections(id) ON DELETE SET NULL;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_service_sections_sort ON service_sections(sort_order);
CREATE INDEX IF NOT EXISTS idx_seating_sections_sort ON seating_sections(sort_order);
CREATE INDEX IF NOT EXISTS idx_services_section_id ON services(section_id);
CREATE INDEX IF NOT EXISTS idx_seating_options_section_id ON seating_options(section_id);

-- Disable RLS (matching existing pattern in this project)
ALTER TABLE service_sections DISABLE ROW LEVEL SECURITY;
ALTER TABLE seating_sections DISABLE ROW LEVEL SECURITY;

-- ============================================================
-- Seed: Luxury Picnics section with 4 category cards
-- ============================================================

-- Create the Luxury Picnics section
INSERT INTO service_sections (title, description, sort_order, is_published)
VALUES ('Luxury Picnics', NULL, 1, true);

-- Insert the 4 Luxury Picnic cards as services with external_url
WITH lp_section AS (
  SELECT id FROM service_sections WHERE title = 'Luxury Picnics' LIMIT 1
)
INSERT INTO services (title, slug, description, image_url, external_url, section_id, sort_order, is_published)
SELECT
  v.title, v.slug, v.description, v.image_url, v.external_url, lp_section.id, v.sort_order, true
FROM (VALUES
  ('Private Celebrations',
   'luxury-private-celebrations',
   'Birthdays, anniversaries, and special moments',
   'https://lh3.googleusercontent.com/pw/AP1GczPuXdFbKwYzagu-IKeAIeEsanOwQkNvLSwinT2L-6mh9eI6zkHXIig_uCwo0JAYtierc_czBxFsTdA5ibP6y3NQxuurn-uu4V4ziU4_BCvlx9HIwzXfV9oX5W84K0BDAo3d0z1L2RyiwKNGns5FSb69iA=w1881-h1148-s-no-gm?authuser=0',
   'https://photos.app.goo.gl/ckg8ty5i3wTcK1yn6',
   0),
  ('Kids Parties',
   'luxury-kids-parties',
   'Fun and memorable celebrations for little ones',
   'https://lh3.googleusercontent.com/pw/AP1GczOXfylvUluOyDLhhDAUsOWf-Mp8sJH-mzYCXlw9Ckgzu8j-Qm8Dps6Tirhzfeopk837-Mx69cvq6XEH3WoAj-wB_qB5IQcs31ajQsTQaq53yrZHTh-Dt5VcCA4xjX0niidSSUKC3Ov2bpPO5ECaOcst1g=w765-h1148-s-no-gm?authuser=0',
   'https://photos.app.goo.gl/zsd37wuZoJiV8HQV8',
   1),
  ('Corporate & Community Events',
   'luxury-corporate-community',
   'Team building and community gatherings',
   'https://lh3.googleusercontent.com/pw/AP1GczOgsRfZKy8oSfSGTqa0zgAI-664oWPmigXvt3Ij4kuIsDU7X69WeIKsUK6Le1NJIXAzglEK5yJGuuO6zAfHgiKF6cJJrqR444fvTYaOXWi9DVtHD0G4_1BEhom7SzYCs2PB_Yqb_nTJvCd6PIqISphoOg=w1722-h1148-s-no-gm?authuser=0',
   'https://photos.app.goo.gl/zK1ZD3MfkkGAVt6K6',
   2),
  ('Wedding Related Celebrations',
   'luxury-wedding-celebrations',
   'Let''s Create Something Beautiful Together',
   'https://lh3.googleusercontent.com/pw/AP1GczPYHxsBNZW5cPhavmFmIpqryvf7zSeVPpwT2ReHUINXB9qQt7woQB3PTzeKpBZahWfaLmHGCmBMO5Vn8-qEbMZMELQujg1XeNIo1sCFc8h43e32HhOiMaIzkC-y3gcJeVFev1t1PhXjuLaODHehvXJcFQ=w1560-h1148-s-no-gm?authuser=0',
   'https://photos.app.goo.gl/TpqVG2rkcuFigHBd9',
   3)
) AS v(title, slug, description, image_url, external_url, sort_order),
lp_section;
