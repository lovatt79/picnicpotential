-- Page heroes table for managing hero sections across pages
CREATE TABLE IF NOT EXISTS page_heroes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_key TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  image_id UUID REFERENCES media(id) ON DELETE SET NULL,
  show_cta BOOLEAN DEFAULT false,
  cta_text TEXT,
  cta_link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE page_heroes ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Allow public read access to page heroes"
  ON page_heroes FOR SELECT
  TO public
  USING (true);

-- Authenticated users can manage
CREATE POLICY "Allow authenticated users to manage page heroes"
  ON page_heroes FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Seed default hero settings for services and seating pages
INSERT INTO page_heroes (page_key, title, description, show_cta, cta_text, cta_link)
VALUES
  ('services', 'Our Services', 'To book any of our services please fill out the Services Request Form. Upon receipt we will respond with pricing and details based on your selections. If there is something you are looking for that you do not see on the form or information you want us to know, please add it to the notes section at the bottom of the form.', true, 'Fill Out Our Services Request Form', '/request'),
  ('seating', 'Seating Styles', 'Choose from a variety of seating options to create the perfect atmosphere for your event. Mix and match styles or keep it consistent — we will help you design the ideal layout for your group.', false, NULL, NULL)
ON CONFLICT (page_key) DO NOTHING;
