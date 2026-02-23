-- Populate testimonials from Google Maps reviews
-- Adds missing columns, fixes RLS, clears existing data, inserts all 20 reviews

-- Add rating column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'testimonials' AND column_name = 'rating'
    ) THEN
        ALTER TABLE testimonials ADD COLUMN rating SMALLINT DEFAULT 5;
    END IF;
END $$;

-- Add review_date column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'testimonials' AND column_name = 'review_date'
    ) THEN
        ALTER TABLE testimonials ADD COLUMN review_date DATE;
    END IF;
END $$;

-- Fix RLS: ensure anon can read, authenticated can do everything
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "testimonials_select_policy" ON testimonials;
DROP POLICY IF EXISTS "testimonials_insert_policy" ON testimonials;
DROP POLICY IF EXISTS "testimonials_update_policy" ON testimonials;
DROP POLICY IF EXISTS "testimonials_delete_policy" ON testimonials;
DROP POLICY IF EXISTS "Public testimonials read access" ON testimonials;
DROP POLICY IF EXISTS "Anyone can read testimonials" ON testimonials;

CREATE POLICY "testimonials_select_policy" ON testimonials FOR SELECT TO public USING (true);
CREATE POLICY "testimonials_insert_policy" ON testimonials FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "testimonials_update_policy" ON testimonials FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "testimonials_delete_policy" ON testimonials FOR DELETE TO authenticated USING (true);

-- Clear existing testimonials
DELETE FROM testimonials;

-- Insert all Google Maps reviews (sorted by most recent first)
INSERT INTO testimonials (text, author, rating, review_date, is_published, show_on_homepage, sort_order) VALUES

-- 1. Ellen Walsh - Sep 2025
(
  'Picnic Potential went above and beyond for the Petaluma Mothers Club Annual Summer Playdate. We couldn''t be happier. Not only was their setup absolutely beautiful, they adjusted their plan to the weather seamlessly! Allison''s team was warm, professional, and incredibly easy to work with. Picnic Potential was very generous to donate their services to help make this event special for families in our community. We''re so grateful for their support and highly recommend them to anyone planning a birthday party, shower, engagement party or a corporate gathering.',
  'Ellen Walsh',
  5, '2025-09-23', true, true, 1
),

-- 2. Joy Finn - Jul 2025
(
  'Alison and her team are fantastic to work with. I can''t believe how beautiful and effortless our event was!!',
  'Joy Finn',
  5, '2025-07-25', true, true, 2
),

-- 3. Stephanie Wong - Apr 2025
(
  'Working with Alison was wonderful! She''s creative and helped my vision come to fruition. I definitely recommend working with her team!',
  'Stephanie Wong',
  5, '2025-04-09', true, false, 3
),

-- 4. Sarah L. - Apr 2025
(
  'Had a great experience with Picnic Potential. They set up a beautiful picnic for me and my friends to celebrate my husband''s birthday. I would definitely use them again and recommend them to others.',
  'Sarah L.',
  5, '2025-04-13', true, false, 4
),

-- 5. D Handal - Aug 2024
(
  'Great set up for our first annual fundraiser for Les Dames Sonoma at Penngrove Park in Penngrove California. Alison and her team did a fantastic job to make the picnic feel inviting.',
  'D Handal',
  5, '2024-08-29', true, false, 5
),

-- 6. Jay Heryford - Aug 2024 (photographer partner)
(
  'I had the pleasure of working with Picnic Potential as their photographer, and I was thoroughly impressed. They crafted a beautiful, stress-free picnic experience, with every detail thoughtfully planned. The setup was stunning and the team was incredibly professional and friendly. If you''re looking for a unique and memorable outdoor experience, I highly recommend working with Ali at Picnic Potential. They truly go above and beyond!',
  'Jay Heryford, North Bay Visuals',
  5, '2024-08-18', true, false, 6
),

-- 7. Christina Oh - Oct 2023
(
  'We loved working with Picnic Potential for my daughter''s 1st birthday party! We asked that everything be setup by 10am, so Picnic Potential arrived by 8am and had everything complete just after 9am. It was wonderful to work with a punctual, professional and lovely team. All our guests were amazed by the beautiful picnic setup. They loved the low tables and cushions for all our baby and toddler guests. After the party ended, they quickly arrived and took care of all the breakdown. Throughout the entire process, they communicated quickly and clearly with us, so we knew exactly what to expect. I would highly recommend them for a social or corporate event.',
  'Christina Oh',
  5, '2023-10-30', true, true, 7
),

-- 8. Mackenzie Mayle - Oct 2023
(
  'Alison was amazing to work with, the design was spot on with the theme of my daughter''s birthday. Drop off and pick up were so easy. I can''t wait use Picnic Potential again.',
  'Mackenzie Mayle',
  5, '2023-10-10', true, false, 8
),

-- 9. Annalisa Puleo - May 2023
(
  'We had a lovely birthday picnic at Armida! The whole process was stress-free and simple. The birthday girl was so surprised by the beautiful set up. The flowers were amazing! Definitely a great experience. Thank you Picnic Potential!',
  'Annalisa Puleo',
  5, '2023-05-18', true, false, 9
),

-- 10. Emily Angulo - Oct 2022
(
  'Alison and her team did an incredible job with the set up for my 30th birthday dinner in Sonoma at our Airbnb. The small details were perfect and my group of friends loved the display. Made for a really cute/fun evening! Would highly recommend Picnic Potential for any special event!',
  'Emily Angulo',
  5, '2022-10-19', true, false, 10
),

-- 11. Haeli Williamsen - Sep 2022
(
  'I would give them a 10 star if I could. Ali did such a beautiful job with our picnic! I was struggling to find something fun and different to do for my boyfriend and I''s anniversary this year, and this absolutely exceeded our expectations! The food was delicious, she was accommodating and set up in a location that was special to us, communicating was so easy and the overall setup was gorgeous. Even the flowers on the table were personal to us. We could not be happier with the experience we had!! We haven''t stopped talking about it since. I will definitely be booking again.',
  'Haeli Williamsen',
  5, '2022-09-27', true, true, 11
),

-- 12. Melissa Le - Sep 2022
(
  'Picnic Potential helped host my bachelorette party to surprise my friends! Everything was very straightforward to book on their website with pictures from their Instagram to help with food and decor. Alison answered any questions I had and was very accommodating.',
  'Melissa Le',
  5, '2022-09-15', true, false, 12
),

-- 13. Autymn Condit - Jul 2022
(
  'Alison helped us plan a beautiful surprise Bachelorette Party located in Kelseyville, CA. I am so thankful she was willing to travel so far out of her normal beat and she did an excellent job overall. Her planning process is clear and straightforward but brings a significant wow factor when it all comes together. The food was super tasty and I will definitely be using Alison to help pull off any future parties.',
  'Autymn Condit',
  5, '2022-07-08', true, false, 13
),

-- 14. Dawn P - Feb 2022
(
  'Alison did an amazing job putting together a unique and magical experience for my daughter''s birthday at Bell Farm Collective. No detail was missed. A special area for the adults to hang out, beautiful picnic set up for the kiddos, and a special tee-pee that the kids loved playing in. Individual lunches for each kid, plus movie snacks. It was better than I imagined. I would highly recommend Alison, she won''t disappoint.',
  'Dawn P.',
  5, '2022-02-22', true, false, 14
),

-- 15. Will Lee - Nov 2021
(
  'Absolutely loved booking a picnic with this business. Alison and her staff are extremely helpful, kind and professional. I booked this picnic to celebrate a late birthday and the acceptance into Acupuncture school for my wife. Alison made recommendations on where to have our picnic and even had custom white doctors coat cookies made! The spot she chose for us was a beautiful location in Tiburon and I didn''t even know it existed. The food was also excellent. My wife was pleasantly surprised and it was quite a sight to arrive to such a beautiful spread. Highly recommend Picnic Potential and will definitely book them again!',
  'Will Lee',
  5, '2021-11-18', true, true, 15
),

-- 16. Julia Marble - Oct 2021
(
  'Ali is amazing to work with! I couldn''t have enough good things to say about her and Picnic Potential. She is kind, responsive, and goes above and beyond in all aspects of the planning and set up. Such gorgeous set ups and decor with personalized touches. Highly recommend for a date night, large event or anything in between!',
  'Julia Marble',
  5, '2021-10-06', true, false, 16
),

-- 17. Ellen Keegan - Sep 2021
(
  'Alison at Picnic Potential was amazing! She was detail oriented, organized and went well above to make my birthday special. The food from Preferred Sonoma was delicious and my guests loved that each person had their own box. Every detail was just perfect — from the flowers, candles, lighting, food, games and the delicious mini pies. I couldn''t be more grateful for the experience she created for my guests and me.',
  'Ellen Keegan',
  5, '2021-09-10', true, false, 17
),

-- 18. Pauline Rogers - Aug 2021 (repeat customer!)
(
  'This is the fourth time in four years I have returned to Picnic Potential to organize an event for me. Alison planned a completely different format for a brunch for our 50th high school class reunion. It was absolutely beautiful and will remain memorable for me and our 60 guests. It was so classy! Thank you Picnic Potential for putting on another very, very special event, and all I had to do was make a couple selections, just show up and simply enjoy the festivities.',
  'Pauline Rogers',
  5, '2021-08-27', true, true, 18
),

-- 19. Tatum Vasquez - Aug 2021
(
  'Such an AMAZING experience with Picnic Potential! I''m not great at planning. Alison made the process so easy! We did a lovely photo shoot/picnic at a gorgeous park in Petaluma. It was the perfect set up! She absolutely nailed it. Highly recommend! Thank you Alison, it was such a pleasure!',
  'Tatum Vasquez',
  5, '2021-08-23', true, false, 19
),

-- 20. Capri Quattrocchi - May 2021
(
  'I highly recommend Picnic Potential! The organizer, Alison, was very kind, professional, organized, and got back to me quickly when I had questions. I had a boho-themed picnic with a few of my close friends for my 18th birthday, and my guests and I loved every part, from the beautiful setup to the delicious sandwich boxes from Preferred Sonoma Caterers. It was such a special way to celebrate. I highly recommend Picnic Potential and I will definitely book another picnic with Alison in the future.',
  'Capri Quattrocchi',
  5, '2021-05-21', true, false, 20
);
