-- =====================================================
-- Wedding Suite Tables
-- =====================================================

-- 1. Package options (3 suite tiers)
CREATE TABLE IF NOT EXISTS ws_package_options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  label VARCHAR(255) NOT NULL,
  description TEXT,
  price NUMERIC(10,2),
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Food & drink options (wedding-specific pricing)
CREATE TABLE IF NOT EXISTS ws_food_options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  label VARCHAR(255) NOT NULL,
  description TEXT,
  price NUMERIC(10,2),
  price_unit VARCHAR(50), -- 'per_person', 'flat', 'per_dozen', etc.
  category VARCHAR(100), -- 'charcuterie', 'drinks', 'desserts'
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Add-on options (essentials, decor, neon signs, flowers, equipment)
CREATE TABLE IF NOT EXISTS ws_addon_options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  label VARCHAR(255) NOT NULL,
  description TEXT,
  price NUMERIC(10,2),
  price_unit VARCHAR(50), -- 'flat', 'per_person', 'per_hour', etc.
  category VARCHAR(100), -- 'essentials', 'decor', 'neon_signs', 'flowers', 'equipment'
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Wedding party gift options (pricing is for set of 6)
CREATE TABLE IF NOT EXISTS ws_gift_options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  label VARCHAR(255) NOT NULL,
  description TEXT,
  price NUMERIC(10,2),
  price_unit VARCHAR(50) DEFAULT 'per_set', -- 'per_set' (of 6)
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Wedding suite submissions
CREATE TABLE IF NOT EXISTS ws_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  -- Contact info
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  email VARCHAR(255) NOT NULL,
  -- Couple info
  couple_name_1 VARCHAR(255),
  couple_name_2 VARCHAR(255),
  -- Venue details
  venue_name VARCHAR(255),
  venue_address TEXT,
  venue_contact_name VARCHAR(255),
  venue_contact_email VARCHAR(255),
  venue_contact_phone VARCHAR(50),
  -- Timing
  event_date DATE,
  arrival_time VARCHAR(100),
  suite_access_time VARCHAR(100),
  -- Details
  people_count VARCHAR(50),
  package VARCHAR(255),
  -- Selections (JSONB arrays of {label, price})
  food_options JSONB DEFAULT '[]'::jsonb,
  addon_options JSONB DEFAULT '[]'::jsonb,
  gift_options JSONB DEFAULT '[]'::jsonb,
  -- Other
  swap_request TEXT,
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
ALTER TABLE ws_package_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE ws_food_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE ws_addon_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE ws_gift_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE ws_submissions ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS Policies: public read for option tables, authenticated full access
-- =====================================================

-- ws_package_options
CREATE POLICY "Allow public read access to ws_package_options"
  ON ws_package_options FOR SELECT TO public USING (true);
CREATE POLICY "Allow authenticated full access to ws_package_options"
  ON ws_package_options FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ws_food_options
CREATE POLICY "Allow public read access to ws_food_options"
  ON ws_food_options FOR SELECT TO public USING (true);
CREATE POLICY "Allow authenticated full access to ws_food_options"
  ON ws_food_options FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ws_addon_options
CREATE POLICY "Allow public read access to ws_addon_options"
  ON ws_addon_options FOR SELECT TO public USING (true);
CREATE POLICY "Allow authenticated full access to ws_addon_options"
  ON ws_addon_options FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ws_gift_options
CREATE POLICY "Allow public read access to ws_gift_options"
  ON ws_gift_options FOR SELECT TO public USING (true);
CREATE POLICY "Allow authenticated full access to ws_gift_options"
  ON ws_gift_options FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ws_submissions: public can insert (form submissions), authenticated full access
CREATE POLICY "Allow public insert to ws_submissions"
  ON ws_submissions FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow public read own ws_submissions"
  ON ws_submissions FOR SELECT TO public USING (true);
CREATE POLICY "Allow authenticated full access to ws_submissions"
  ON ws_submissions FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- =====================================================
-- Updated_at trigger for ws_submissions
-- =====================================================
CREATE OR REPLACE FUNCTION update_ws_submissions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS ws_submissions_updated_at ON ws_submissions;
CREATE TRIGGER ws_submissions_updated_at
  BEFORE UPDATE ON ws_submissions
  FOR EACH ROW EXECUTE FUNCTION update_ws_submissions_updated_at();

-- =====================================================
-- Seed data: Packages
-- =====================================================
INSERT INTO ws_package_options (label, description, price, sort_order) VALUES
  ('Suiteheart Space', 'Intimate setup for the wedding party to relax and prepare', 450, 1),
  ('Serenity Suite', 'Enhanced suite experience with premium touches', 700, 2),
  ('Luxe Haven', 'The ultimate luxury suite with all the extras', 1100, 3);

-- =====================================================
-- Seed data: Food & Drink options
-- =====================================================
INSERT INTO ws_food_options (label, description, price, price_unit, category, sort_order) VALUES
  -- Charcuterie
  ('Small Charcuterie Board', 'Serves 4-8 guests', 75, 'flat', 'charcuterie', 1),
  ('Medium Charcuterie Board', 'Serves 8-15 guests', 125, 'flat', 'charcuterie', 2),
  ('Large Charcuterie Board', 'Serves 15-25 guests', 175, 'flat', 'charcuterie', 3),
  ('Extra Large Charcuterie Board', 'Serves 25+ guests', 250, 'flat', 'charcuterie', 4),
  -- Drinks
  ('Mimosa Bar', 'Orange juice, champagne, and fresh fruit garnishes', 12, 'per_person', 'drinks', 10),
  ('Iced Coffee Bar', 'Iced coffee with assorted syrups and creamers', 8, 'per_person', 'drinks', 11),
  -- Desserts
  ('Dessert Bar', 'Assorted mini desserts', 10, 'per_person', 'desserts', 20),
  ('Chocolate Covered Strawberries', 'One dozen hand-dipped strawberries', 45, 'per_dozen', 'desserts', 21),
  ('Cookies', 'Assorted decorated cookies', 36, 'per_dozen', 'desserts', 22);

-- =====================================================
-- Seed data: Add-on options
-- =====================================================
INSERT INTO ws_addon_options (label, description, price, price_unit, category, sort_order) VALUES
  -- Essentials
  ('Robes', 'Matching robes for the wedding party', 25, 'per_person', 'essentials', 1),
  ('Slippers', 'Cozy slippers for the wedding party', 15, 'per_person', 'essentials', 2),
  ('Hangers', 'Custom wedding hangers for attire', 12, 'per_person', 'essentials', 3),
  ('Getting Ready Shirts', 'Matching getting-ready shirts', 20, 'per_person', 'essentials', 4),
  -- Decor
  ('Balloon Garland', 'Custom balloon garland installation', 150, 'flat', 'decor', 10),
  ('Welcome Sign', 'Custom welcome sign for the suite', 75, 'flat', 'decor', 11),
  ('Candles & Florals', 'Candle and floral decor package', 125, 'flat', 'decor', 12),
  ('Table Runner & Linens', 'Elegant table styling', 85, 'flat', 'decor', 13),
  -- Neon Signs
  ('Better Together Neon Sign', 'LED neon sign rental', 100, 'flat', 'neon_signs', 20),
  ('Custom Neon Sign', 'Custom text LED neon sign rental', 200, 'flat', 'neon_signs', 21),
  ('Just Married Neon Sign', 'LED neon sign rental', 100, 'flat', 'neon_signs', 22),
  ('Love Neon Sign', 'LED neon sign rental', 100, 'flat', 'neon_signs', 23),
  -- Flowers
  ('Bud Vases (set of 5)', 'Small bud vase arrangements', 75, 'flat', 'flowers', 30),
  ('Centerpiece Arrangement', 'Statement floral centerpiece', 125, 'flat', 'flowers', 31),
  ('Floral Garland', 'Fresh floral garland for tables', 200, 'flat', 'flowers', 32),
  -- Equipment
  ('Bluetooth Speaker', 'Portable speaker for music', 25, 'flat', 'equipment', 40),
  ('Ring Light', 'Professional ring light for photos', 35, 'flat', 'equipment', 41),
  ('Polaroid Camera + Film', 'Instant camera with 20 shots', 50, 'flat', 'equipment', 42),
  ('Steamer', 'Garment steamer for attire', 20, 'flat', 'equipment', 43);

-- =====================================================
-- Seed data: Gift options (priced per set of 6)
-- =====================================================
INSERT INTO ws_gift_options (label, description, price, price_unit, sort_order) VALUES
  ('Custom Tumblers', 'Personalized tumblers for the wedding party', 120, 'per_set', 1),
  ('Custom Tote Bags', 'Personalized tote bags for the wedding party', 90, 'per_set', 2),
  ('Spa Gift Sets', 'Luxe spa gift set with bath products', 150, 'per_set', 3),
  ('Custom Champagne Flutes', 'Personalized champagne flutes', 108, 'per_set', 4),
  ('Custom Jewelry Boxes', 'Personalized jewelry boxes', 132, 'per_set', 5),
  ('Custom Satin PJs', 'Personalized satin pajama sets', 180, 'per_set', 6);
