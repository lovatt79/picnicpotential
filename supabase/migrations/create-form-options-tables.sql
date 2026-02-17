-- Create form options tables
-- All form options share similar structure: label, value (for select), price (for paid items), sort_order, is_active

-- Event Types
CREATE TABLE IF NOT EXISTS form_event_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label VARCHAR(255) NOT NULL,
  value VARCHAR(255) NOT NULL UNIQUE,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Color Options
CREATE TABLE IF NOT EXISTS form_color_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label VARCHAR(255) NOT NULL UNIQUE,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Food Options
CREATE TABLE IF NOT EXISTS form_food_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label VARCHAR(255) NOT NULL,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Dessert Options
CREATE TABLE IF NOT EXISTS form_dessert_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label VARCHAR(255) NOT NULL,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add-on Options
CREATE TABLE IF NOT EXISTS form_addon_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label VARCHAR(255) NOT NULL,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Occasion Options
CREATE TABLE IF NOT EXISTS form_occasion_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label VARCHAR(255) NOT NULL UNIQUE,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Attribution/How Did You Hear Options
CREATE TABLE IF NOT EXISTS form_attribution_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label VARCHAR(255) NOT NULL UNIQUE,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed Event Types
INSERT INTO form_event_types (label, value, sort_order) VALUES
  ('Picnic', 'picnic', 0),
  ('Tablescapes', 'tablescapes', 1),
  ('Event Decor', 'event-decor', 2),
  ('Rentals', 'rentals', 3);

-- Seed Color Options
INSERT INTO form_color_options (label, sort_order) VALUES
  ('Pretty in Pink', 0),
  ('Citrus Party (Orange, White, Yellow and Green)', 1),
  ('Coral and Sage', 2),
  ('Pink Lemonade (Pink and Yellow)', 3),
  ('Boho (Neutrals)', 4),
  ('Boho Dusty Blue', 5),
  ('Baby Blue', 6),
  ('Sapphire Blue', 7),
  ('Pastel Rainbow', 8),
  ('Black and Hot Pink', 9),
  ('Black and White Farmhouse', 10),
  ('Red White and Blue', 11),
  ('Purple and Gray', 12),
  ('Bright Color Pop (Hot Pink, Yellow, Green, Orange and Turquoise)', 13),
  ('Sage, White and Gold', 14),
  ('Fall Set Up (Aug 15-Dec 1)', 15),
  ('Surprise Me!', 16);

-- Seed Food Options
INSERT INTO form_food_options (label, sort_order) VALUES
  ('Charcuterie $25/person (Min order of 2)', 0),
  ('Brunch Board/Box $25', 1),
  ('Individual Sandwich Box $20', 2),
  ('Individual Sandwich Wrap $20 (Turkey Bacon Ranch, Southwest Chicken or Chicken Caesar)', 3),
  ('Individual Salad $18 (10+ Varieties)', 4),
  ('Fruit Platter (Serves 4-6) $75', 5),
  ('Crudités Platter (Serves 4-6) $75', 6),
  ('Hummus Platter (Serves 4-6) $75', 7),
  ('Skewer Platter (Serves 6-8) $85', 8);

-- Seed Dessert Options
INSERT INTO form_dessert_options (label, sort_order) VALUES
  ('Assorted Dessert Box $30', 0),
  ('Dozen Themed Cookies $50/dozen', 1),
  ('Personalized Place Card Cookies $6/each', 2),
  ('Mini Bundt Cakes - 6 Pack $20', 3),
  ('Mini Pies $3.50/each, min order of 6 (blueberry, apple, cherry)', 4),
  ('Cake Jars $3.50/each, min order of 6', 5),
  ('Cake Pops $3.50/each, min order of 6', 6),
  ('Cake Popsicles $3.50/each, min order of 6', 7),
  ('Cake (4"=$38, 6"=$60, 8"=$80, 10"=$100)', 8),
  ('Macaron Cookies - 1 Dozen $36', 9),
  ('Lg Homemade Cookies - 1 Dozen $33', 10),
  ('Brownie Bites - 1 Dozen $25', 11),
  ('Chocolate Dipped Dessert Box $25', 12),
  ('Cupcakes $3.50/each, min order of 6', 13),
  ('VEGAN: Sugar Cookie Bars - 1 Dozen $24', 14),
  ('VEGAN: Macaron Cookies - 1 Dozen $33', 15),
  ('VEGAN: Oreo Mousse Cup $3.50/each, min order of 6', 16),
  ('VEGAN: Fruit Tart - 1 Dozen $36', 17),
  ('VEGAN: Mini Cheesecake Cups $3.50/each, min order of 6', 18),
  ('VEGAN: Truffles - 1 Dozen $30', 19),
  ('VEGAN: Lemon Bar - 1 Dozen $24', 20),
  ('VEGAN: Biscoff Brownie - 1 Dozen $30', 21);

-- Seed Add-on Options
INSERT INTO form_addon_options (label, sort_order) VALUES
  ('Adirondack Chair $40', 0),
  ('Juice Carafe $20/each', 1),
  ('Large Juice Dispenser $50', 2),
  ('Lawn Game: Connect Four $20', 3),
  ('Lawn Game: Large Connect Four $40', 4),
  ('Lawn Game: Jenga $15', 5),
  ('Corn Hole $50', 6),
  ('Igloo Bubble Tent $150 (Max Group Size: 6)', 7),
  ('Lace Tent $35', 8),
  ('Umbrella $50', 9),
  ('Cabana $150', 10),
  ('Small Flowers $55', 11),
  ('Medium Flowers $80', 12),
  ('Large Flowers $120', 13),
  ('Professional Photographer - Starting at $300 (1 hour, 30 edited photos)', 14);

-- Seed Occasion Options
INSERT INTO form_occasion_options (label, sort_order) VALUES
  ('Friends Get Together', 0),
  ('Bachelor/Bachelorette', 1),
  ('Bridal Shower', 2),
  ('Baby Shower / Sip & See', 3),
  ('Birthday', 4),
  ('Birthday - Surprise Party', 5),
  ('Corporate Gathering', 6),
  ('Proposal with Picnic', 7),
  ('Proposal (Non Picnic)', 8),
  ('Community Event', 9),
  ('Private Event', 10),
  ('Kids Birthday', 11),
  ('Anniversary', 12),
  ('Graduation Party', 13),
  ('Date Night', 14);

-- Seed Attribution Options
INSERT INTO form_attribution_options (label, sort_order) VALUES
  ('I am a past client', 0),
  ('Facebook', 1),
  ('Instagram (@Picnic.Potential)', 2),
  ('TikTok', 3),
  ('Referral', 4),
  ('Kendall Jackson Website', 5),
  ('Matanzas Creek Website', 6),
  ('Rodney Strong Website', 7),
  ('Paradise Ridge Winery Website', 8),
  ('Kohmsa Luxury Vacation Rentals Website/Email', 9),
  ('Mascarin Winery Website', 10);

-- Disable RLS for development
ALTER TABLE form_event_types DISABLE ROW LEVEL SECURITY;
ALTER TABLE form_color_options DISABLE ROW LEVEL SECURITY;
ALTER TABLE form_food_options DISABLE ROW LEVEL SECURITY;
ALTER TABLE form_dessert_options DISABLE ROW LEVEL SECURITY;
ALTER TABLE form_addon_options DISABLE ROW LEVEL SECURITY;
ALTER TABLE form_occasion_options DISABLE ROW LEVEL SECURITY;
ALTER TABLE form_attribution_options DISABLE ROW LEVEL SECURITY;
