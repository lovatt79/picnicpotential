-- ============================================================
-- Populate Service Page Content for Wedding Suite Services
-- Safe to re-run: cleans up existing data first, then inserts.
-- ============================================================


-- ─── Clean up any existing features (fixes duplicates) ─────

DELETE FROM service_features
WHERE service_page_id IN (
  SELECT sp.id FROM service_pages sp
  JOIN services s ON sp.service_id = s.id
  WHERE s.slug IN ('the-suiteheart-space', 'the-serenity-suite', 'the-luxe-haven', 'the-suite-essentials')
);


-- ─── Ensure service_pages rows exist ───────────────────────

INSERT INTO service_pages (service_id)
SELECT id FROM services WHERE slug = 'the-suiteheart-space'
ON CONFLICT (service_id) DO NOTHING;

INSERT INTO service_pages (service_id)
SELECT id FROM services WHERE slug = 'the-serenity-suite'
ON CONFLICT (service_id) DO NOTHING;

INSERT INTO service_pages (service_id)
SELECT id FROM services WHERE slug = 'the-luxe-haven'
ON CONFLICT (service_id) DO NOTHING;

INSERT INTO service_pages (service_id)
SELECT id FROM services WHERE slug = 'the-suite-essentials'
ON CONFLICT (service_id) DO NOTHING;


-- ─── Update Page Content ───────────────────────────────────

-- The Suiteheart Space
UPDATE service_pages
SET
  hero_subtitle = 'Starting at $500',
  intro_text = 'Our most charming getting-ready suite package — everything you need to relax, celebrate, and get camera-ready before the big moment. Sip mimosas, snack on charcuterie, and soak in every second with your favorite people.

The Suiteheart Space transforms any room into a cozy, Instagram-worthy retreat where you and your crew can laugh, toast, and enjoy the calm before the celebration begins.',
  features_section_title = 'What''s Included',
  features_section_description = 'Everything you need for a memorable getting-ready experience',
  gallery_section_title = 'Suite Inspiration',
  gallery_section_description = 'See how we''ve styled getting-ready suites for past celebrations',
  cta_section_title = 'Ready to Book Your Suite?',
  cta_section_description = 'Fill out our request form and we''ll set up the perfect getting-ready space for your special day. We''ll handle every detail so you can focus on enjoying the moment.',
  cta_button_text = 'Request This Package',
  cta_button_link = '/request',
  updated_at = NOW()
WHERE service_id = (SELECT id FROM services WHERE slug = 'the-suiteheart-space');

-- The Serenity Suite
UPDATE service_pages
SET
  hero_subtitle = 'Starting at $650',
  intro_text = 'An elevated getting-ready experience with premium bites, refreshing drinks, and beautiful decor. The Serenity Suite brings a touch of luxury to your pre-ceremony moments so you can truly unwind and enjoy.

From a curated mimosa or iced coffee bar to a stunning floral centerpiece and marquee letters, every detail is designed to make your getting-ready time feel just as special as the celebration itself.',
  features_section_title = 'What''s Included',
  features_section_description = 'A premium getting-ready experience with elevated bites, drinks, and decor',
  gallery_section_title = 'Suite Inspiration',
  gallery_section_description = 'See how we''ve styled getting-ready suites for past celebrations',
  cta_section_title = 'Ready to Book Your Suite?',
  cta_section_description = 'Fill out our request form and we''ll create a serene, luxurious getting-ready experience for your celebration. Every detail handled, every moment savored.',
  cta_button_text = 'Request This Package',
  cta_button_link = '/request',
  updated_at = NOW()
WHERE service_id = (SELECT id FROM services WHERE slug = 'the-serenity-suite');

-- The Luxe Haven
UPDATE service_pages
SET
  hero_subtitle = 'Starting at $1,000',
  intro_text = 'Our most luxurious getting-ready suite package — full decor, stunning florals, gourmet platters, and statement marquee letters that set the tone for an unforgettable day. This is the ultimate pre-ceremony experience.

The Luxe Haven is designed for those who want every detail to be absolutely perfect. From a personalized hanger and bouquet stand to 3-foot marquee letters and an abundant spread of gourmet food, this package turns your getting-ready space into a celebration of its own.',
  features_section_title = 'What''s Included',
  features_section_description = 'Our most comprehensive suite package with full decor, florals, and gourmet food',
  gallery_section_title = 'Suite Inspiration',
  gallery_section_description = 'See how we''ve styled getting-ready suites for past celebrations',
  cta_section_title = 'Ready to Book Your Suite?',
  cta_section_description = 'Fill out our request form and we''ll design the ultimate getting-ready haven for your celebration. This is the experience you and your crew deserve.',
  cta_button_text = 'Request This Package',
  cta_button_link = '/request',
  updated_at = NOW()
WHERE service_id = (SELECT id FROM services WHERE slug = 'the-luxe-haven');

-- The Suite Essentials
UPDATE service_pages
SET
  hero_subtitle = '$150 Add-On Package',
  intro_text = 'The practical finishing touches to complete your getting-ready suite. Add a coat rack, steamer, full-length mirror, and privacy screen to any suite package for total comfort and convenience.

Sometimes it''s the little things that make the biggest difference. The Suite Essentials ensures your space has everything you need to get dressed, touch up, and feel amazing — without a single worry.

Note: The Suite Essentials package is only available as an add-on to one of our other suite packages.',
  features_section_title = 'What''s Included',
  features_section_description = 'Practical essentials to complete your getting-ready suite',
  gallery_section_title = 'Suite Inspiration',
  gallery_section_description = 'See how we''ve styled getting-ready suites for past celebrations',
  cta_section_title = 'Add This to Your Suite Package',
  cta_section_description = 'The Suite Essentials is available as an add-on to any of our suite packages. Request your suite and include this for the complete experience!',
  cta_button_text = 'Request a Suite Package',
  cta_button_link = '/request',
  updated_at = NOW()
WHERE service_id = (SELECT id FROM services WHERE slug = 'the-suite-essentials');


-- ─── Service Features (What's Included items) ─────────────

-- The Suiteheart Space features
INSERT INTO service_features (service_page_id, title, description, icon, sort_order)
VALUES
  ((SELECT sp.id FROM service_pages sp JOIN services s ON sp.service_id = s.id WHERE s.slug = 'the-suiteheart-space'),
   'Personalized Hanger', 'A custom hanger for your wedding day outfit — the perfect detail for getting-ready photos', 'heart', 1),
  ((SELECT sp.id FROM service_pages sp JOIN services s ON sp.service_id = s.id WHERE s.slug = 'the-suiteheart-space'),
   'Mimosa Bar', 'Refreshing mimosas set up and ready to toast with your crew as you get ready', 'champagne', 2),
  ((SELECT sp.id FROM service_pages sp JOIN services s ON sp.service_id = s.id WHERE s.slug = 'the-suiteheart-space'),
   'Charcuterie Snack Boxes', 'Individual charcuterie boxes so everyone can snack without the mess', 'cheese', 3),
  ((SELECT sp.id FROM service_pages sp JOIN services s ON sp.service_id = s.id WHERE s.slug = 'the-suiteheart-space'),
   'Small Floral Centerpiece', 'A lovely floral arrangement to brighten the room and tie the decor together', 'flowers', 4),
  ((SELECT sp.id FROM service_pages sp JOIN services s ON sp.service_id = s.id WHERE s.slug = 'the-suiteheart-space'),
   'Snack Basket', 'A curated basket of snacks to keep energy up throughout the day', 'gift', 5);

-- The Serenity Suite features
INSERT INTO service_features (service_page_id, title, description, icon, sort_order)
VALUES
  ((SELECT sp.id FROM service_pages sp JOIN services s ON sp.service_id = s.id WHERE s.slug = 'the-serenity-suite'),
   'Personalized Hanger', 'A custom hanger for your wedding day outfit — the perfect detail for getting-ready photos', 'heart', 1),
  ((SELECT sp.id FROM service_pages sp JOIN services s ON sp.service_id = s.id WHERE s.slug = 'the-serenity-suite'),
   'Mimosa or Iced Coffee Bar', 'Choose mimosas, iced coffees, or a mix of both — whatever fits your vibe', 'champagne', 2),
  ((SELECT sp.id FROM service_pages sp JOIN services s ON sp.service_id = s.id WHERE s.slug = 'the-serenity-suite'),
   'Charcuterie Platter', 'A beautifully arranged charcuterie platter to share with your crew', 'cheese', 3),
  ((SELECT sp.id FROM service_pages sp JOIN services s ON sp.service_id = s.id WHERE s.slug = 'the-serenity-suite'),
   'Small Bite Dessert Assortment', 'A delightful selection of bite-sized desserts for a sweet treat', 'cupcake', 4),
  ((SELECT sp.id FROM service_pages sp JOIN services s ON sp.service_id = s.id WHERE s.slug = 'the-serenity-suite'),
   'Medium Floral Centerpiece', 'A stunning floral arrangement that elevates the entire space', 'flowers', 5),
  ((SELECT sp.id FROM service_pages sp JOIN services s ON sp.service_id = s.id WHERE s.slug = 'the-serenity-suite'),
   'Small Marquee Letters', 'Light-up marquee letters for a fun, glowing photo moment', 'lights', 6),
  ((SELECT sp.id FROM service_pages sp JOIN services s ON sp.service_id = s.id WHERE s.slug = 'the-serenity-suite'),
   'Snack Basket', 'A curated basket of snacks to keep energy up throughout the day', 'gift', 7);

-- The Luxe Haven features
INSERT INTO service_features (service_page_id, title, description, icon, sort_order)
VALUES
  ((SELECT sp.id FROM service_pages sp JOIN services s ON sp.service_id = s.id WHERE s.slug = 'the-luxe-haven'),
   'Personalized Hanger', 'A custom hanger for your wedding day outfit — the perfect detail for getting-ready photos', 'heart', 1),
  ((SELECT sp.id FROM service_pages sp JOIN services s ON sp.service_id = s.id WHERE s.slug = 'the-luxe-haven'),
   'Bouquet Stand', 'An elegant stand to display bouquets beautifully while you get ready', 'flowers', 2),
  ((SELECT sp.id FROM service_pages sp JOIN services s ON sp.service_id = s.id WHERE s.slug = 'the-luxe-haven'),
   '10 Bud Vases & 10 Tealights', 'Delicate bud vases and flickering tealights placed throughout for a romantic ambiance', 'vase', 3),
  ((SELECT sp.id FROM service_pages sp JOIN services s ON sp.service_id = s.id WHERE s.slug = 'the-luxe-haven'),
   '3ft Marquee Letters', 'Statement-making 3-foot marquee letters — the ultimate photo backdrop', 'lights', 4),
  ((SELECT sp.id FROM service_pages sp JOIN services s ON sp.service_id = s.id WHERE s.slug = 'the-luxe-haven'),
   'Charcuterie & Sandwich Platter', 'A gourmet spread of charcuterie and sandwiches to keep everyone fueled', 'cheese', 5),
  ((SELECT sp.id FROM service_pages sp JOIN services s ON sp.service_id = s.id WHERE s.slug = 'the-luxe-haven'),
   'Fruit or Crudités Platter', 'A fresh fruit or crudités platter for a lighter, refreshing option', 'strawberry', 6),
  ((SELECT sp.id FROM service_pages sp JOIN services s ON sp.service_id = s.id WHERE s.slug = 'the-luxe-haven'),
   'Medium Floral Centerpiece', 'A stunning floral arrangement as the room''s show-stopping centerpiece', 'flowers', 7);

-- The Suite Essentials features
INSERT INTO service_features (service_page_id, title, description, icon, sort_order)
VALUES
  ((SELECT sp.id FROM service_pages sp JOIN services s ON sp.service_id = s.id WHERE s.slug = 'the-suite-essentials'),
   'Coat Rack', 'Keep garments wrinkle-free, organized, and ready to go', 'check', 1),
  ((SELECT sp.id FROM service_pages sp JOIN services s ON sp.service_id = s.id WHERE s.slug = 'the-suite-essentials'),
   'Steamer', 'A professional steamer on hand for any last-minute touch-ups', 'sparkles', 2),
  ((SELECT sp.id FROM service_pages sp JOIN services s ON sp.service_id = s.id WHERE s.slug = 'the-suite-essentials'),
   'Standing Mirror', 'A full-length mirror for that final head-to-toe look before the big moment', 'star', 3),
  ((SELECT sp.id FROM service_pages sp JOIN services s ON sp.service_id = s.id WHERE s.slug = 'the-suite-essentials'),
   'Privacy Screen', 'A stylish privacy screen for comfortable, stress-free changing', 'check', 4);
