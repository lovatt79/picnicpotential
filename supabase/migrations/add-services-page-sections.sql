-- Table for Luxury Picnic Categories (4 cards on /services page)
CREATE TABLE IF NOT EXISTS luxury_picnic_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  gradient_class VARCHAR(100), -- e.g., 'from-blush to-peach-light'
  sort_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table for general services page sections (Community Seating, Corporate Events, etc.)
CREATE TABLE IF NOT EXISTS services_page_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key VARCHAR(100) UNIQUE NOT NULL, -- e.g., 'community_seating', 'corporate_events'
  title VARCHAR(255),
  content TEXT,
  link_text VARCHAR(255),
  link_url VARCHAR(500),
  sort_order INTEGER DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table for corporate partners (logos on /services page)
CREATE TABLE IF NOT EXISTS corporate_partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  logo_id UUID REFERENCES media(id) ON DELETE SET NULL,
  logo_url VARCHAR(500), -- Backward compatibility
  url VARCHAR(500),
  sort_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_luxury_picnic_categories_sort ON luxury_picnic_categories(sort_order);
CREATE INDEX IF NOT EXISTS idx_services_page_sections_sort ON services_page_sections(sort_order);
CREATE INDEX IF NOT EXISTS idx_corporate_partners_sort ON corporate_partners(sort_order);
CREATE INDEX IF NOT EXISTS idx_corporate_partners_logo_id ON corporate_partners(logo_id);

-- Disable RLS for now
ALTER TABLE luxury_picnic_categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE services_page_sections DISABLE ROW LEVEL SECURITY;
ALTER TABLE corporate_partners DISABLE ROW LEVEL SECURITY;

-- Seed Luxury Picnic Categories with existing data
INSERT INTO luxury_picnic_categories (title, description, gradient_class, sort_order, is_published) VALUES
  ('Private Celebrations', 'Birthdays, anniversaries, girls'' days, date nights and more.', 'from-blush to-peach-light', 0, true),
  ('Kids Parties', 'Fun, colorful setups perfect for your little one''s special day.', 'from-lavender-light to-sky-light', 1, true),
  ('Corporate & Community Events', 'Team building, family days, festivals and community gatherings.', 'from-peach-light to-blush-light', 2, true),
  ('Brand Trips', 'Curated experiences for influencers and brand activations.', 'from-sky-light to-sage-light', 3, true)
ON CONFLICT DO NOTHING;

-- Seed Services Page Sections with existing content
INSERT INTO services_page_sections (section_key, title, content, link_text, link_url, sort_order, is_visible) VALUES
  ('community_seating', 'Community Event Seating', 'If you are an event organizer seeking to enhance your space with additional seating or decor, we offer thoughtfully designed solutions to suit your needs. Select from a variety of seating styles or incorporate a curated mix, accommodating guests who desire a luxury picnic experience alongside those who prefer traditional chairs or table seating. Our chair vignettes also serve as refined additions to often-overlooked areas — such as lawns designated for games — encouraging all guests to engage in the experience, whether actively participating or simply enjoying the atmosphere as spectators.', 'View All Seating Styles →', '/seating', 0, true),

  ('corporate_events', 'Corporate Events', 'Our picnics, tablescapes, decor and rentals are all great for corporate groups. Whether you are doing a team building off site, a family picnic day or a breakout session for a corporate retreat, we have a setup for you. We will work with your venue and internal coordinator to create spaces that keep your team engaged, comfortable all while offering a unique wine country experience. One of our recent setups was a brand trip for influencers that included a kayak trip down the Russian River and ending with a beachside picnic at Monte Rio Beach!', NULL, NULL, 1, true),

  ('tablescapes', 'Tablescapes', 'Each guest is welcomed with a thoughtfully curated place setting, including a personalized place card, plate, cutlery, napkin, and drink goblet. The tablescape is further enhanced with elegant runners, ambient LED lighting, curated decor, and statement centerpieces. While our standard setup features high-quality disposable plates and cutlery, clients may opt for premium, non-disposable tableware, available through our trusted local rental partner.', NULL, NULL, 2, true),

  ('proposals', 'Proposals', 'Curate an exceptional proposal for you and your partner — one that beautifully captures the significance of "I do" and creates memories to cherish for a lifetime. Whether you choose from one of our thoughtfully designed proposal packages or craft a fully bespoke experience, our team is dedicated to bringing your vision to life with elegance and care.', NULL, NULL, 3, true),

  ('wedding_suite', 'Wedding Suite & Hotel Suite Decor', 'Our wedding suite packages are thoughtfully designed for couples who want their getting-ready space to feel just as beautiful and intentional as the rest of their celebration — without the stress of coordinating every last detail. We take care of the essentials (and the indulgences), from curated food and drinks to elegant decor and playful, memorable add-ons that elevate the experience and set the tone for your day.', 'Wedding Suite Decor Request Form', '/request', 4, true),

  ('rentals', 'Rentals & DIY Rental Kits', 'Stay tuned for our exciting new rental options and DIY kits, perfect for creating your own beautiful setup with our curated collection.', NULL, NULL, 5, true)
ON CONFLICT (section_key) DO NOTHING;
