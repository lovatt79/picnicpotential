-- Migrate winery_partners to vendor_partners with partner_type='Winery'
INSERT INTO vendor_partners (name, partner_type, category, is_published)
SELECT name, 'Winery', 'Winery', is_published
FROM winery_partners
WHERE NOT EXISTS (
  SELECT 1 FROM vendor_partners WHERE name = winery_partners.name
);

-- Drop winery_partners table after migration
DROP TABLE IF EXISTS winery_partners;
