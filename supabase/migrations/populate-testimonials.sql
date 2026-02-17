-- Populate Testimonials with actual content

-- First, ensure the show_on_homepage column exists (in case create-testimonials-table.sql wasn't run)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'testimonials' AND column_name = 'show_on_homepage'
    ) THEN
        ALTER TABLE testimonials ADD COLUMN show_on_homepage BOOLEAN DEFAULT false;
    END IF;
END $$;

-- Clear existing testimonials to avoid duplicates
DELETE FROM testimonials;

-- Insert new testimonials
INSERT INTO testimonials (text, author, show_on_homepage, sort_order, is_published) VALUES
(
  'They are amazing. I contacted Alison about doing a surprise proposal picnic disguised as a birthday picnic and I could not be happier with the way everything turned out. When arriving we were greeted and guided to the picnic area. We were blown away by how beautifully set up everything was! It was definitely a more special experience thanks to the care and detail that Alison and her staff showed',
  'Jose',
  true,
  1,
  true
),
(
  'Alison was so wonderful!!! She threw a surprise 40th birthday celebration at a beautiful winery and everything was perfect!! Every little detail was just so on point and all the girls especially the birthday girl loved it!! I only wish I lived in the area so I could have her do an event for me!!! Would highly recommend for any event!!!',
  'Roxanne',
  true,
  2,
  true
),
(
  'This is the fourth time in four years I have returned to Picnic Potential to organize an event for me. Alison planned a completely different format for a 50th high school reunion brunch. It was absolutely beautiful and will remain memorable for me and our 60 guests.',
  'Pauline',
  true,
  3,
  true
);
