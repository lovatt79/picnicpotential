-- Collection pages: curated groups of services shown as standalone pages
CREATE TABLE IF NOT EXISTS collection_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  hero_subtitle TEXT,
  hero_image_id UUID,
  meta_description TEXT,
  sort_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Junction table: which services belong to which collection
CREATE TABLE IF NOT EXISTS collection_page_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_page_id UUID NOT NULL REFERENCES collection_pages(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  custom_title VARCHAR(255),
  custom_description TEXT,
  is_coming_soon BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(collection_page_id, service_id)
);

CREATE INDEX IF NOT EXISTS idx_collection_pages_slug ON collection_pages(slug);
CREATE INDEX IF NOT EXISTS idx_collection_pages_sort ON collection_pages(sort_order);
CREATE INDEX IF NOT EXISTS idx_collection_page_items_collection ON collection_page_items(collection_page_id);

ALTER TABLE collection_pages DISABLE ROW LEVEL SECURITY;
ALTER TABLE collection_page_items DISABLE ROW LEVEL SECURITY;

-- Seed: Weddings collection
INSERT INTO collection_pages (title, slug, description, hero_subtitle, sort_order, is_published)
VALUES (
  'Weddings',
  'weddings',
  'Everything you need for your perfect wedding celebration.',
  'From luxury picnics to suite decor, we make your special day unforgettable.',
  0,
  true
);

-- Link wedding services (will be run after services exist)
INSERT INTO collection_page_items (collection_page_id, service_id, sort_order)
SELECT cp.id, s.id,
  CASE s.slug
    WHEN 'luxury-wedding-celebrations' THEN 0
    WHEN 'wedding-suite' THEN 1
  END
FROM collection_pages cp, services s
WHERE cp.slug = 'weddings'
  AND s.slug IN ('luxury-wedding-celebrations', 'wedding-suite');

-- Seed: New in 2026 collection
INSERT INTO collection_pages (title, slug, description, hero_subtitle, sort_order, is_published)
VALUES (
  'New in 2026',
  'new-2026',
  'Exciting new services and partnerships coming to Picnic Potential in 2026.',
  'We''re expanding! Check out what''s new this year.',
  1,
  true
);

-- Link new-2026 services (adjust slugs as needed)
INSERT INTO collection_page_items (collection_page_id, service_id, is_coming_soon, sort_order)
SELECT cp.id, s.id,
  CASE WHEN s.slug IN ('rentals') THEN true ELSE false END,
  ROW_NUMBER() OVER (ORDER BY s.sort_order) - 1
FROM collection_pages cp, services s
WHERE cp.slug = 'new-2026'
  AND s.slug IN ('wedding-suite', 'rentals');
