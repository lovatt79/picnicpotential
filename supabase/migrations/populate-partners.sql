-- Populate Partners with researched content

-- First, ensure additional columns exist for partner details
DO $$
BEGIN
    -- Add description column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'vendor_partners' AND column_name = 'description'
    ) THEN
        ALTER TABLE vendor_partners ADD COLUMN description TEXT;
    END IF;

    -- Add website column if it doesn't exist (rename url to website or add both)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'vendor_partners' AND column_name = 'website'
    ) THEN
        ALTER TABLE vendor_partners ADD COLUMN website TEXT;
    END IF;

    -- Add instagram column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'vendor_partners' AND column_name = 'instagram'
    ) THEN
        ALTER TABLE vendor_partners ADD COLUMN instagram TEXT;
    END IF;
END $$;

-- Update the partner_type constraint to include 'Winery'
ALTER TABLE vendor_partners DROP CONSTRAINT IF EXISTS vendor_partners_partner_type_check;
ALTER TABLE vendor_partners ADD CONSTRAINT vendor_partners_partner_type_check
    CHECK (partner_type IN ('VIP', 'Preferred', 'Winery'));

-- Clear existing partners to avoid duplicates
DELETE FROM vendor_partners;

-- VIP Partners - Charcuterie/Grazing Tables

INSERT INTO vendor_partners (
  name,
  partner_type,
  category,
  description,
  location,
  website,
  instagram,
  is_published,
  sort_order
) VALUES
(
  'La Bella Charcuterie',
  'VIP',
  'Charcuterie/Grazing Tables',
  'La Bella Charcuterie creates curated charcuterie boards and grazing experiences with high-quality ingredients, attention to detail, and genuine care. Offering everything from signature boards to full-service grazing tables for weddings and corporate events, plus interactive charcuterie-making workshops.',
  'Petaluma (serving Sonoma, Napa, and Marin counties)',
  'https://labellacharcuterie.com/',
  'https://www.instagram.com/labellacharcuterie/',
  true,
  1
),
(
  'Field and Farm Boards',
  'VIP',
  'Charcuterie/Grazing Tables',
  'The original catering company in Sonoma County specializing in lavish charcuterie & cheese platters. Each display is customized and unique, featuring premium fresh produce, artisanal cheeses, and cured meats. Offering specialty boards, grazing tables, and individual bite boxes.',
  'Healdsburg and Windsor',
  'https://www.fieldandfarmboards.com/',
  null,
  true,
  2
),
(
  'Board and Bounty',
  'VIP',
  'Charcuterie/Grazing Tables',
  'Custom charcuterie board company creating fresh, creative, and delicious platters for events of all sizes. Prioritizing local sourcing for honey, jams, produce, cheese, and baked goods. Offering individual cups, personal boxes, grazing boards, custom tables, and charcuterie-making classes.',
  'Santa Rosa (free delivery within 10 miles of 95403)',
  'https://boardandbounty.net/',
  null,
  true,
  3
),

-- VIP Partners - Desserts

(
  'Sweet Sugarsmith',
  'VIP',
  'Desserts',
  'Custom dessert bakery specializing in sugar cookies, cakes, cupcakes, and mini-bundt cakes. Each creation is crafted with care and attention to detail, perfect for making your special occasions even sweeter.',
  'Sonoma County',
  null,
  'https://www.instagram.com/sweetsugarsmith/',
  true,
  4
),

-- VIP Partners - Flowers

(
  'Marmalade Sky Floral Design',
  'VIP',
  'Flowers',
  'Full-service floral studio offering custom arrangements for any occasion, subscriptions, classes, and events. Owner Kim Thomas creates beautiful and timeless florals with vintage, modern designs. Specializing in wedding décor including centerpieces, arches, and stunning bouquets.',
  'Petaluma (serving Sonoma, Napa, and Mendocino Counties)',
  'https://www.marmaladeskyfloraldesign.com/',
  'https://www.instagram.com/marmalade_sky_floral_designs/',
  true,
  5
),

-- Preferred Partners - Balloons

(
  'Your Balloon Dream Company',
  'Preferred',
  'Balloons',
  'Making dream events come alive with professional balloon styling and backdrop design. Specializing in creating stunning balloon installations and party entertainment for events throughout Sonoma, Napa, Marin County and beyond.',
  'Sonoma County',
  null,
  'https://www.instagram.com/yourballoondream.co/',
  true,
  6
),
(
  'Manuia Designs',
  'Preferred',
  'Balloons',
  'Northern California event decorator offering custom balloon backdrops and silk floral rentals for weddings and parties. Professional-looking décor with custom Grab & Go Balloon Garlands and Event Packages ready to shine at your celebration.',
  'Marin County (serving Sonoma, Napa, Marin and the Bay Area)',
  'https://www.manuiadesigns.com/',
  'https://www.instagram.com/manuia.designs/',
  true,
  7
),
(
  'Celebrations of Marin',
  'Preferred',
  'Balloons',
  'Marin''s premier event equipment rental supplier serving the entire Bay Area. Offering organic balloon garlands and arches for any occasion, along with comprehensive party and event rental equipment including tables, chairs, concessions machines, and more.',
  'Marin County',
  'https://www.celebrationsofmarin.com/',
  'https://www.instagram.com/celebrationsofmarin/',
  true,
  8
),

-- Preferred Partners - Photographers

(
  'Studio J by SJ',
  'Preferred',
  'Photography',
  'Award-winning fine art photographer Sheila Johnson specializes in wedding and proposal photography with 10+ years of expertise. Based in Sebastopol, serving Napa, Santa Rosa, Sonoma and beyond. Patient, creative, and talented with attention to detail, turning your memories into timeless art.',
  'Sebastopol (serving Sonoma and Napa)',
  'https://www.studiojportraits.com/',
  'https://www.instagram.com/studiojbysj/',
  true,
  9
),
(
  'Photos by Haeli',
  'Preferred',
  'Photography',
  'Traveling wedding & lifestyle photographer creating warm and colorful images. Based in Northern California with a passion for giving people the ability to look back and re-live the moments they shared with the people they love.',
  'Sonoma, San Francisco & Beyond',
  'https://photosbyhaeli.com/',
  'https://www.instagram.com/photos.by.haeli/',
  true,
  10
),

-- Winery Partners

(
  'Paradise Ridge Winery',
  'Winery',
  'Winery',
  'Nestled on a 155-acre estate offering spectacular natural vistas overlooking vineyards and the Russian River Valley. Named Best Tasting Room in California by USA Today in 2016. Features a world-class sculpture garden, self-guided vineyard walks, and exceptional wines. Private wedding venue accommodates up to 250 guests.',
  'Santa Rosa, CA',
  'https://www.prwinery.com/',
  'https://www.instagram.com/paradiseridgewinery/',
  true,
  11
),
(
  'Landmark Vineyards',
  'Winery',
  'Winery',
  'Founded by Damaris Deere Ford, great-great-granddaughter of John Deere. Features two stunning locations: the Kenwood Estate at the foothills of the Mayacamas Mountains with picnic grounds and Bocce Ball court, and the Hop Kiln Estate in a registered California Historical Landmark from 1905. Specializing in ultra-premium Chardonnay and Pinot Noir.',
  'Kenwood & Healdsburg (Hop Kiln Estate)',
  'https://www.landmarkwine.com/',
  null,
  true,
  12
),
(
  'Mascarin Family Wines',
  'Winery',
  'Winery',
  'Family-owned vineyard and winery rooted in over 15 years of craftsmanship. Nestled behind 8 acres of vineyards down a dirt road outside Healdsburg, surrounded by towering olive trees overlooking Dry Creek. Showcasing terroir-driven wines from sustainable farming, featuring limited-production Chardonnay, Pinot Noir, and estate Red Field Blend.',
  'Healdsburg, CA',
  'https://mascarin-wines.com/',
  null,
  true,
  13
),
(
  'Hamilton Family Wines',
  'Winery',
  'Winery',
  'Handcrafted wines from organically and sustainably harvested Sonoma Valley vineyards. Established in 2019 by Greg and Lindsay Hamilton, featuring naturally fermented wines that are minimally processed, unrefined, unfiltered, low in sulfites, and vegan-friendly. Serene wine garden setting nestled amidst olive trees and grapevines. Walk-in, picnic, pet, and child friendly.',
  'Kenwood, CA',
  'https://hamilton.wine/',
  null,
  true,
  14
);
