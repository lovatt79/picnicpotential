-- Update the 3 existing proposal service pages with package content
-- Run this in the Supabase SQL Editor

-- ─── The Intimate Picnic Proposal ─────────────────────────────

-- Ensure service_pages row exists (creates if missing)
INSERT INTO service_pages (service_id)
SELECT id FROM services WHERE slug = 'the-intimate-picnic-proposal'
ON CONFLICT (service_id) DO NOTHING;

-- Update page content
UPDATE service_pages
SET
  hero_subtitle = 'A romantic picnic proposal for two',
  intro_text = 'Our most intimate proposal package — a beautifully styled picnic for two with all the details that make the moment unforgettable.',
  features_section_title = 'What''s Included',
  cta_section_title = 'Ready to Plan Your Proposal?',
  cta_section_description = 'Fill out our request form and we''ll help you create the perfect proposal experience.',
  cta_button_text = 'Start Planning',
  cta_button_link = '/request',
  updated_at = NOW()
WHERE service_id = (SELECT id FROM services WHERE slug = 'the-intimate-picnic-proposal');

-- Update the service description and starting price
UPDATE services
SET
  description = 'Starting at $500',
  updated_at = NOW()
WHERE slug = 'the-intimate-picnic-proposal';

-- Clear any existing features and insert fresh
DELETE FROM service_features
WHERE service_page_id = (
  SELECT sp.id FROM service_pages sp
  JOIN services s ON sp.service_id = s.id
  WHERE s.slug = 'the-intimate-picnic-proposal'
);

INSERT INTO service_features (service_page_id, title, description, icon, sort_order)
VALUES
  ((SELECT sp.id FROM service_pages sp JOIN services s ON sp.service_id = s.id WHERE s.slug = 'the-intimate-picnic-proposal'),
   'Picnic for Two', 'An intimate picnic setup designed for a romantic proposal', 'heart', 1),
  ((SELECT sp.id FROM service_pages sp JOIN services s ON sp.service_id = s.id WHERE s.slug = 'the-intimate-picnic-proposal'),
   '9" Marquee Letters', 'Eye-catching marquee letters to set the scene', 'lights', 2),
  ((SELECT sp.id FROM service_pages sp JOIN services s ON sp.service_id = s.id WHERE s.slug = 'the-intimate-picnic-proposal'),
   'Charcuterie', 'A beautifully arranged charcuterie board', 'cheese', 3),
  ((SELECT sp.id FROM service_pages sp JOIN services s ON sp.service_id = s.id WHERE s.slug = 'the-intimate-picnic-proposal'),
   'Chocolate Covered Strawberries', 'Decadent chocolate covered strawberries', 'strawberry', 4),
  ((SELECT sp.id FROM service_pages sp JOIN services s ON sp.service_id = s.id WHERE s.slug = 'the-intimate-picnic-proposal'),
   'Small Floral Centerpiece', 'A lovely floral centerpiece to complete the setting', 'flowers', 5);


-- ─── The Signature Proposal ──────────────────────────────────

INSERT INTO service_pages (service_id)
SELECT id FROM services WHERE slug = 'the-signature-proposal'
ON CONFLICT (service_id) DO NOTHING;

UPDATE service_pages
SET
  hero_subtitle = 'Our most popular proposal package',
  intro_text = 'The Signature Proposal elevates the experience with a neon sign, dessert assortment, and your choice of a picnic or backdrop setup.',
  features_section_title = 'What''s Included',
  cta_section_title = 'Ready to Plan Your Proposal?',
  cta_section_description = 'Fill out our request form and we''ll help you create the perfect proposal experience.',
  cta_button_text = 'Start Planning',
  cta_button_link = '/request',
  updated_at = NOW()
WHERE service_id = (SELECT id FROM services WHERE slug = 'the-signature-proposal');

UPDATE services
SET
  description = 'Starting at $700',
  updated_at = NOW()
WHERE slug = 'the-signature-proposal';

DELETE FROM service_features
WHERE service_page_id = (
  SELECT sp.id FROM service_pages sp
  JOIN services s ON sp.service_id = s.id
  WHERE s.slug = 'the-signature-proposal'
);

INSERT INTO service_features (service_page_id, title, description, icon, sort_order)
VALUES
  ((SELECT sp.id FROM service_pages sp JOIN services s ON sp.service_id = s.id WHERE s.slug = 'the-signature-proposal'),
   'Picnic or Backdrop', 'Choose between an intimate picnic setup or a stunning backdrop', 'outdoors', 1),
  ((SELECT sp.id FROM service_pages sp JOIN services s ON sp.service_id = s.id WHERE s.slug = 'the-signature-proposal'),
   'Marry Me Neon Sign', 'A glowing neon sign for the perfect photo moment', 'lights', 2),
  ((SELECT sp.id FROM service_pages sp JOIN services s ON sp.service_id = s.id WHERE s.slug = 'the-signature-proposal'),
   'Charcuterie', 'A beautifully arranged charcuterie board', 'cheese', 3),
  ((SELECT sp.id FROM service_pages sp JOIN services s ON sp.service_id = s.id WHERE s.slug = 'the-signature-proposal'),
   'Small Bite Dessert Assortment', 'A curated assortment of small bite desserts', 'cupcake', 4),
  ((SELECT sp.id FROM service_pages sp JOIN services s ON sp.service_id = s.id WHERE s.slug = 'the-signature-proposal'),
   'Medium Floral Centerpiece', 'A beautiful medium floral centerpiece', 'flowers', 5);


-- ─── The Luxe Proposal ───────────────────────────────────────

INSERT INTO service_pages (service_id)
SELECT id FROM services WHERE slug = 'the-luxe-proposal'
ON CONFLICT (service_id) DO NOTHING;

UPDATE service_pages
SET
  hero_subtitle = 'The ultimate proposal experience',
  intro_text = 'Our most lavish proposal package — featuring both a picnic and backdrop, oversized marquee letters, a deluxe dessert spread, and abundant florals for a truly unforgettable moment.',
  features_section_title = 'What''s Included',
  cta_section_title = 'Ready to Plan Your Proposal?',
  cta_section_description = 'Fill out our request form and we''ll help you create the perfect proposal experience.',
  cta_button_text = 'Start Planning',
  cta_button_link = '/request',
  updated_at = NOW()
WHERE service_id = (SELECT id FROM services WHERE slug = 'the-luxe-proposal');

UPDATE services
SET
  description = 'Starting at $1,000',
  updated_at = NOW()
WHERE slug = 'the-luxe-proposal';

DELETE FROM service_features
WHERE service_page_id = (
  SELECT sp.id FROM service_pages sp
  JOIN services s ON sp.service_id = s.id
  WHERE s.slug = 'the-luxe-proposal'
);

INSERT INTO service_features (service_page_id, title, description, icon, sort_order)
VALUES
  ((SELECT sp.id FROM service_pages sp JOIN services s ON sp.service_id = s.id WHERE s.slug = 'the-luxe-proposal'),
   'Picnic and Backdrop', 'Both a picnic setup and a stunning backdrop included', 'outdoors', 1),
  ((SELECT sp.id FROM service_pages sp JOIN services s ON sp.service_id = s.id WHERE s.slug = 'the-luxe-proposal'),
   '4ft Marry Me Marquee Letters', 'Oversized 4-foot marquee letters for maximum impact', 'lights', 2),
  ((SELECT sp.id FROM service_pages sp JOIN services s ON sp.service_id = s.id WHERE s.slug = 'the-luxe-proposal'),
   'Charcuterie', 'A beautifully arranged charcuterie board', 'cheese', 3),
  ((SELECT sp.id FROM service_pages sp JOIN services s ON sp.service_id = s.id WHERE s.slug = 'the-luxe-proposal'),
   'Deluxe Dessert', 'A premium deluxe dessert spread', 'cupcake', 4),
  ((SELECT sp.id FROM service_pages sp JOIN services s ON sp.service_id = s.id WHERE s.slug = 'the-luxe-proposal'),
   'Large Floral Centerpiece', 'A grand floral centerpiece as the focal point', 'flowers', 5),
  ((SELECT sp.id FROM service_pages sp JOIN services s ON sp.service_id = s.id WHERE s.slug = 'the-luxe-proposal'),
   '10 Bud Vases', 'Ten bud vases to add floral touches throughout the setup', 'vase', 6);
