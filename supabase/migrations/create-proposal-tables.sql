-- =====================================================
-- Proposal Tables
-- =====================================================

-- 1. Package options (3 proposal tiers)
CREATE TABLE IF NOT EXISTS prop_package_options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  label VARCHAR(255) NOT NULL,
  description TEXT,
  price NUMERIC(10,2),
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Add-on options (decor extras)
CREATE TABLE IF NOT EXISTS prop_addon_options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  label VARCHAR(255) NOT NULL,
  description TEXT,
  price NUMERIC(10,2),
  price_unit VARCHAR(50) DEFAULT 'flat',
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Food & flower add-on options
CREATE TABLE IF NOT EXISTS prop_food_options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  label VARCHAR(255) NOT NULL,
  description TEXT,
  price NUMERIC(10,2),
  price_unit VARCHAR(50) DEFAULT 'flat',
  category VARCHAR(100), -- 'food', 'flowers'
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Proposal submissions
CREATE TABLE IF NOT EXISTS proposal_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  -- Contact info
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  email VARCHAR(255) NOT NULL,
  -- Proposal details
  proposee_name VARCHAR(255),
  proposal_date_1 DATE,
  proposal_date_2 DATE,
  proposal_time VARCHAR(100),
  location TEXT,
  colors TEXT,
  -- Selections
  package VARCHAR(255),
  addon_options JSONB DEFAULT '[]'::jsonb,
  food_options JSONB DEFAULT '[]'::jsonb,
  -- Other
  how_did_you_hear VARCHAR(255),
  how_did_you_hear_other VARCHAR(255),
  notes TEXT,
  -- Admin
  status VARCHAR(50) DEFAULT 'new',
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- Enable RLS on all tables
-- =====================================================
ALTER TABLE prop_package_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE prop_addon_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE prop_food_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposal_submissions ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS Policies
-- =====================================================

-- prop_package_options
CREATE POLICY "Allow public read access to prop_package_options"
  ON prop_package_options FOR SELECT TO public USING (true);
CREATE POLICY "Allow authenticated full access to prop_package_options"
  ON prop_package_options FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- prop_addon_options
CREATE POLICY "Allow public read access to prop_addon_options"
  ON prop_addon_options FOR SELECT TO public USING (true);
CREATE POLICY "Allow authenticated full access to prop_addon_options"
  ON prop_addon_options FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- prop_food_options
CREATE POLICY "Allow public read access to prop_food_options"
  ON prop_food_options FOR SELECT TO public USING (true);
CREATE POLICY "Allow authenticated full access to prop_food_options"
  ON prop_food_options FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- proposal_submissions
CREATE POLICY "Allow public insert to proposal_submissions"
  ON proposal_submissions FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow public read own proposal_submissions"
  ON proposal_submissions FOR SELECT TO public USING (true);
CREATE POLICY "Allow authenticated full access to proposal_submissions"
  ON proposal_submissions FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- =====================================================
-- Updated_at trigger for proposal_submissions
-- =====================================================
CREATE OR REPLACE FUNCTION update_proposal_submissions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS proposal_submissions_updated_at ON proposal_submissions;
CREATE TRIGGER proposal_submissions_updated_at
  BEFORE UPDATE ON proposal_submissions
  FOR EACH ROW EXECUTE FUNCTION update_proposal_submissions_updated_at();

-- =====================================================
-- Seed data: Packages
-- =====================================================
INSERT INTO prop_package_options (label, description, price, sort_order) VALUES
  ('The Intimate Picnic Proposal', 'Picnic for Two, 9" Marquee Letters, Charcuterie, Chocolate Covered Strawberries, Small Floral Centerpiece', 500, 1),
  ('The Signature Proposal', 'Picnic or Backdrop, Marry Me Neon Sign, Charcuterie, Small Bite Dessert Assortment, Medium Floral Centerpiece', 700, 2),
  ('The Luxe Proposal', 'Picnic and Backdrop, 4ft Marry Me Marquee Letters, Charcuterie, Deluxe Dessert, Large Floral Centerpiece, 10 Bud Vases', 1000, 3);

-- =====================================================
-- Seed data: Add-on options
-- =====================================================
INSERT INTO prop_addon_options (label, description, price, price_unit, sort_order) VALUES
  ('Umbrella', NULL, 50, 'flat', 1),
  ('Cabana', NULL, 150, 'flat', 2),
  ('10 Additional Bud Vases', NULL, NULL, 'flat', 3),
  ('Igloo Bubble Tent', NULL, 150, 'flat', 4),
  ('Decorative Table Overhang', NULL, 50, 'flat', 5),
  ('Will You Marry Me Neon Sign', NULL, 85, 'flat', 6),
  ('20 Hurricane Vases', NULL, 75, 'flat', 7),
  ('Rose Petals', NULL, NULL, 'flat', 8);

-- =====================================================
-- Seed data: Food & flower add-on options
-- =====================================================
INSERT INTO prop_food_options (label, description, price, price_unit, category, sort_order) VALUES
  -- Food
  ('Sandwich Meal Box for Two', NULL, 40, 'flat', 'food', 1),
  ('Charcuterie Meal Box for Two', NULL, 50, 'flat', 'food', 2),
  ('Chocolate Covered Strawberries', NULL, 25, 'flat', 'food', 3),
  ('Assorted Dessert Box', NULL, 25, 'flat', 'food', 4),
  -- Flowers
  ('Additional Flowers - Small', NULL, 55, 'flat', 'flowers', 10),
  ('Additional Flowers - Medium', NULL, 80, 'flat', 'flowers', 11),
  ('Additional Flowers - Large', NULL, 120, 'flat', 'flowers', 12);
