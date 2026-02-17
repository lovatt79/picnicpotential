-- Create testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  text TEXT NOT NULL,
  author VARCHAR(255) NOT NULL,
  is_published BOOLEAN DEFAULT true,
  show_on_homepage BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed with existing hardcoded testimonials
INSERT INTO testimonials (text, author, is_published, show_on_homepage, sort_order) VALUES
  ('Alison was so wonderful!!! She threw a surprise 40th birthday celebration at a beautiful winery and everything was perfect!! Every little detail was just so on point and all the girls especially the birthday girl loved it!! I only wish I lived in the area so I could have her do an event for me!!!', 'Roxanne', true, true, 0),
  ('The most magical experience! Picnic Potential created the most beautiful setup for our anniversary. The attention to detail was incredible and made our celebration truly unforgettable.', 'Sarah M.', true, true, 1),
  ('We booked a corporate team-building picnic and it was the highlight of our retreat. Professional, elegant, and so much fun. Highly recommend for any group event!', 'David L.', true, true, 2);

-- Disable RLS for development
ALTER TABLE testimonials DISABLE ROW LEVEL SECURITY;
