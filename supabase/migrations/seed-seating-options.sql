-- Seed seating options with initial content
-- Run this in the Supabase SQL Editor

INSERT INTO seating_options (title, description, sort_order, is_published) VALUES
(
  'Picnic Seating',
  'Picnic setups are great for any occasion and can accommodate groups of up to 100 in a variety of seating formats. Keep conversations intimate with groups of 6-10 or do an extended long table. All picnics include ground cover, cushions, table, disposable placesettings, wine goblets and table decor. Guests are welcome to add florals, food and other add on options while filling out the Picnic Request Form.',
  1,
  true
),
(
  'Lounge',
  'Lounge setups are similar to picnics but do not include the dining table down the center. Lounge setups are perfect for additional seating at your backyard bbq or for events like outdoor concerts or the gift opening portion of a shower. Lounge setups include ground cover, 2-3 cushions per quilts, a small table and light decor.',
  2,
  true
),
(
  'Chair Vignettes',
  'Chair vignettes can be added to any of our other set ups or stand on their own. Similar to a lounge set up they include a small table, light decor and adirondack chairs with throw pillows. Chair vignettes are perfect for anyone who wants the same look and feel of a picnic but for guests who do not want to sit on the ground. Want a perfectly shaded experience? You can add chairs to our cabana set ups also.',
  3,
  true
),
(
  'Cabana Setups',
  'Cabanas provide a perfectly shaded experience for an intimate group of four or larger groups with the accompaniment of umbrellas to shade the entire group. Cabanas can be added to shade a picnic, a lounge set up or chair vignettes and are often used as VIP areas at events as well.',
  4,
  true
),
(
  'Tablescapes',
  'Whether it is an intimate dinner among friends, a date night or tables for a large special occasion like a wedding or shower, our tablescapes provide an elevated look that becomes one of many fond memories of your special day. Our tablescapes include floral centerpieces and decor. We are happy to use your place settings or we will source rentals accordingly based on your color scheme or theme.',
  5,
  true
),
(
  'Igloo Tent',
  'Accommodates a max of 6 guests. This clear igloo tent is available year round and is for a picnic, a cozy date night, a movie night with the kids or an awesome holiday hot chocolate party. The igloo tent is well ventilated and can be decorated in any theme or colors. The igloo tent can also be used for party decor if you want a champagne "bubble" theme for your bar or a cute seating area at your backyard gathering.',
  6,
  true
);
