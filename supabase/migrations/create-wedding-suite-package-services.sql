-- ============================================================
-- Wedding Suite Package Services
-- These are uncategorized (no section_id) so they appear
-- only in collections, not on the public /services page.
-- ============================================================

INSERT INTO services (title, slug, description, sort_order, is_published)
VALUES
  (
    'The Suiteheart Space',
    'the-suiteheart-space',
    'Starting at $500. A charming getting-ready suite setup with all the essentials for your special day.',
    100,
    true
  ),
  (
    'The Serenity Suite',
    'the-serenity-suite',
    'Starting at $650. An elevated getting-ready suite experience with premium bites, drinks, and decor.',
    101,
    true
  ),
  (
    'The Luxe Haven',
    'the-luxe-haven',
    'Starting at $1,000. Our most luxurious getting-ready suite package with full decor, florals, and gourmet platters.',
    102,
    true
  ),
  (
    'The Suite Essentials',
    'the-suite-essentials',
    '$150 add-on. Practical essentials to complete any getting-ready suite package.',
    103,
    true
  )
ON CONFLICT (slug) DO NOTHING;


-- ============================================================
-- Service Pages (detail page content)
-- ============================================================

-- The Suiteheart Space
INSERT INTO service_pages (service_id, hero_subtitle, intro_text, features_section_title, features_section_description, cta_section_title, cta_section_description, cta_button_text, cta_button_link)
SELECT id,
  'Starting at $500',
  'Our most charming getting-ready suite package — everything you need to relax, celebrate, and get camera-ready before the big moment. Sip mimosas, snack on charcuterie, and soak in every second with your favorite people.',
  'What''s Included',
  'Everything in The Suiteheart Space package',
  'Ready to Book Your Suite?',
  'Fill out our request form and we''ll set up the perfect getting-ready space for your special day.',
  'Request This Package',
  '/request'
FROM services WHERE slug = 'the-suiteheart-space'
ON CONFLICT (service_id) DO NOTHING;

-- The Serenity Suite
INSERT INTO service_pages (service_id, hero_subtitle, intro_text, features_section_title, features_section_description, cta_section_title, cta_section_description, cta_button_text, cta_button_link)
SELECT id,
  'Starting at $650',
  'An elevated getting-ready experience with premium bites, refreshing drinks, and beautiful decor. The Serenity Suite brings a touch of luxury to your pre-ceremony moments so you can truly unwind and enjoy.',
  'What''s Included',
  'Everything in The Serenity Suite package',
  'Ready to Book Your Suite?',
  'Fill out our request form and we''ll create a serene getting-ready experience for your celebration.',
  'Request This Package',
  '/request'
FROM services WHERE slug = 'the-serenity-suite'
ON CONFLICT (service_id) DO NOTHING;

-- The Luxe Haven
INSERT INTO service_pages (service_id, hero_subtitle, intro_text, features_section_title, features_section_description, cta_section_title, cta_section_description, cta_button_text, cta_button_link)
SELECT id,
  'Starting at $1,000',
  'Our most luxurious getting-ready suite package — full decor, stunning florals, gourmet platters, and marquee letters that set the tone for an unforgettable day. This is the ultimate pre-ceremony experience.',
  'What''s Included',
  'Everything in The Luxe Haven package',
  'Ready to Book Your Suite?',
  'Fill out our request form and we''ll design the ultimate getting-ready haven for your celebration.',
  'Request This Package',
  '/request'
FROM services WHERE slug = 'the-luxe-haven'
ON CONFLICT (service_id) DO NOTHING;

-- The Suite Essentials
INSERT INTO service_pages (service_id, hero_subtitle, intro_text, features_section_title, features_section_description, cta_section_title, cta_section_description, cta_button_text, cta_button_link)
SELECT id,
  '$150 Add-On',
  'The practical finishing touches to complete your getting-ready suite. Add a coat rack, steamer, mirror, and privacy screen to any suite package for total comfort and convenience.',
  'What''s Included',
  'Everything in The Suite Essentials add-on',
  'Add This to Your Suite Package',
  'The Suite Essentials package is only available in addition to one of our other suite packages. Request your suite and add this on!',
  'Request a Suite Package',
  '/request'
FROM services WHERE slug = 'the-suite-essentials'
ON CONFLICT (service_id) DO NOTHING;


-- ============================================================
-- Service Features (What's Included items)
-- ============================================================

-- The Suiteheart Space features
INSERT INTO service_features (service_page_id, title, description, icon, sort_order)
VALUES
  ((SELECT sp.id FROM service_pages sp JOIN services s ON sp.service_id = s.id WHERE s.slug = 'the-suiteheart-space'),
   'Personalized Hanger', 'A custom hanger for your wedding day outfit', 'heart', 1),
  ((SELECT sp.id FROM service_pages sp JOIN services s ON sp.service_id = s.id WHERE s.slug = 'the-suiteheart-space'),
   'Mimosa Bar', 'Refreshing mimosas to toast with your crew', 'champagne', 2),
  ((SELECT sp.id FROM service_pages sp JOIN services s ON sp.service_id = s.id WHERE s.slug = 'the-suiteheart-space'),
   'Charcuterie Snack Boxes', 'Individual charcuterie boxes for everyone in the suite', 'cheese', 3),
  ((SELECT sp.id FROM service_pages sp JOIN services s ON sp.service_id = s.id WHERE s.slug = 'the-suiteheart-space'),
   'Small Floral Centerpiece', 'A lovely floral arrangement to brighten the room', 'flowers', 4),
  ((SELECT sp.id FROM service_pages sp JOIN services s ON sp.service_id = s.id WHERE s.slug = 'the-suiteheart-space'),
   'Snack Basket', 'A curated basket of snacks to keep energy up all day', 'gift', 5);

-- The Serenity Suite features
INSERT INTO service_features (service_page_id, title, description, icon, sort_order)
VALUES
  ((SELECT sp.id FROM service_pages sp JOIN services s ON sp.service_id = s.id WHERE s.slug = 'the-serenity-suite'),
   'Personalized Hanger', 'A custom hanger for your wedding day outfit', 'heart', 1),
  ((SELECT sp.id FROM service_pages sp JOIN services s ON sp.service_id = s.id WHERE s.slug = 'the-serenity-suite'),
   'Mimosa or Iced Coffee Bar', 'Choose mimosas or iced coffees — or mix it up', 'champagne', 2),
  ((SELECT sp.id FROM service_pages sp JOIN services s ON sp.service_id = s.id WHERE s.slug = 'the-serenity-suite'),
   'Charcuterie Platter', 'A beautifully arranged charcuterie platter to share', 'cheese', 3),
  ((SELECT sp.id FROM service_pages sp JOIN services s ON sp.service_id = s.id WHERE s.slug = 'the-serenity-suite'),
   'Small Bite Dessert Assortment', 'A delightful selection of bite-sized desserts', 'cupcake', 4),
  ((SELECT sp.id FROM service_pages sp JOIN services s ON sp.service_id = s.id WHERE s.slug = 'the-serenity-suite'),
   'Medium Floral Centerpiece', 'A stunning floral arrangement to elevate the space', 'flowers', 5),
  ((SELECT sp.id FROM service_pages sp JOIN services s ON sp.service_id = s.id WHERE s.slug = 'the-serenity-suite'),
   'Small Marquee Letters', 'Light-up marquee letters for a fun photo moment', 'lights', 6),
  ((SELECT sp.id FROM service_pages sp JOIN services s ON sp.service_id = s.id WHERE s.slug = 'the-serenity-suite'),
   'Snack Basket', 'A curated basket of snacks to keep energy up all day', 'gift', 7);

-- The Luxe Haven features
INSERT INTO service_features (service_page_id, title, description, icon, sort_order)
VALUES
  ((SELECT sp.id FROM service_pages sp JOIN services s ON sp.service_id = s.id WHERE s.slug = 'the-luxe-haven'),
   'Personalized Hanger', 'A custom hanger for your wedding day outfit', 'heart', 1),
  ((SELECT sp.id FROM service_pages sp JOIN services s ON sp.service_id = s.id WHERE s.slug = 'the-luxe-haven'),
   'Bouquet Stand', 'An elegant stand to display bouquets while getting ready', 'flowers', 2),
  ((SELECT sp.id FROM service_pages sp JOIN services s ON sp.service_id = s.id WHERE s.slug = 'the-luxe-haven'),
   '10 Bud Vases & 10 Tealights', 'Delicate bud vases and tealights for a romantic ambiance', 'vase', 3),
  ((SELECT sp.id FROM service_pages sp JOIN services s ON sp.service_id = s.id WHERE s.slug = 'the-luxe-haven'),
   '3ft Marquee Letters', 'Statement-making 3-foot marquee letters for the ultimate photo backdrop', 'lights', 4),
  ((SELECT sp.id FROM service_pages sp JOIN services s ON sp.service_id = s.id WHERE s.slug = 'the-luxe-haven'),
   'Charcuterie & Sandwich Platter', 'A gourmet spread of charcuterie and sandwiches for the group', 'cheese', 5),
  ((SELECT sp.id FROM service_pages sp JOIN services s ON sp.service_id = s.id WHERE s.slug = 'the-luxe-haven'),
   'Fruit or Crudites Platter', 'Fresh fruit or crudites platter for a lighter option', 'strawberry', 6),
  ((SELECT sp.id FROM service_pages sp JOIN services s ON sp.service_id = s.id WHERE s.slug = 'the-luxe-haven'),
   'Medium Floral Centerpiece', 'A stunning floral arrangement as the room''s centerpiece', 'flowers', 7);

-- The Suite Essentials features
INSERT INTO service_features (service_page_id, title, description, icon, sort_order)
VALUES
  ((SELECT sp.id FROM service_pages sp JOIN services s ON sp.service_id = s.id WHERE s.slug = 'the-suite-essentials'),
   'Coat Rack', 'Keep garments wrinkle-free and organized', 'check', 1),
  ((SELECT sp.id FROM service_pages sp JOIN services s ON sp.service_id = s.id WHERE s.slug = 'the-suite-essentials'),
   'Steamer', 'A steamer on hand for any last-minute touch-ups', 'sparkles', 2),
  ((SELECT sp.id FROM service_pages sp JOIN services s ON sp.service_id = s.id WHERE s.slug = 'the-suite-essentials'),
   'Standing Mirror', 'A full-length mirror for that final look', 'star', 3),
  ((SELECT sp.id FROM service_pages sp JOIN services s ON sp.service_id = s.id WHERE s.slug = 'the-suite-essentials'),
   'Privacy Screen', 'A privacy screen for comfortable changing', 'check', 4);
