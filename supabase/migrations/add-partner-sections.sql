-- ============================================================
-- Partner Sections — allow grouping partners into named sections
-- (mirrors service_sections / seating_sections pattern)
-- ============================================================

-- 1. Create the partner_sections table
CREATE TABLE IF NOT EXISTS partner_sections (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  description TEXT,
  badge_label TEXT,           -- optional short label for the badge (e.g. "VIP Partners")
  badge_style TEXT DEFAULT 'gold', -- 'gold' | 'sage' | 'cream' for frontend styling
  sort_order  INT NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_partner_sections_sort ON partner_sections (sort_order);

-- 2. Add section_id to vendor_partners
ALTER TABLE vendor_partners
  ADD COLUMN IF NOT EXISTS section_id UUID REFERENCES partner_sections(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_vendor_partners_section ON vendor_partners (section_id);

-- 3. Disable RLS (matches project pattern)
ALTER TABLE partner_sections DISABLE ROW LEVEL SECURITY;

-- 4. Seed the three existing sections
INSERT INTO partner_sections (id, title, description, badge_label, badge_style, sort_order) VALUES
  (
    'a0000000-0000-0000-0000-000000000001',
    'Our VIP Partners',
    'These are the vendors that offer the charcuterie, flowers and baked goods you see on our order form. When you request these items on the Service Request Form you do not need to contact them — we handle all orders, coordination, set up and pick up.',
    'VIP Partners',
    'gold',
    0
  ),
  (
    'a0000000-0000-0000-0000-000000000002',
    'Our Preferred Partners',
    'This is a curated list of local vendors who provide a superb level of service and we are happy to refer you to them. If you are interested in any of these services you can add it to the notes section of the Service Request Form and we will put you in touch with our contact at these businesses to arrange services. When needed, we are happy to jump in and communicate regarding the day of deliveries and pick ups.',
    'Preferred Partners',
    'sage',
    1
  ),
  (
    'a0000000-0000-0000-0000-000000000003',
    'Our Winery Partners',
    'We partner with exceptional wineries throughout Sonoma County to create unforgettable experiences. Each location offers unique settings perfect for picnics, events, and celebrations.',
    'Winery Partners',
    'gold',
    2
  );

-- 5. Migrate existing partners to use section_id based on partner_type
UPDATE vendor_partners
  SET section_id = 'a0000000-0000-0000-0000-000000000001'
  WHERE partner_type = 'VIP';

UPDATE vendor_partners
  SET section_id = 'a0000000-0000-0000-0000-000000000002'
  WHERE partner_type = 'Preferred';

UPDATE vendor_partners
  SET section_id = 'a0000000-0000-0000-0000-000000000003'
  WHERE partner_type = 'Winery';
