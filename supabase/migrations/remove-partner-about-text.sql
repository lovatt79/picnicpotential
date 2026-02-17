-- Remove duplicate about_text field from partner_pages
-- The description field on vendor_partners is used instead

-- First, copy any existing about_text to the partner's description if description is null
UPDATE vendor_partners vp
SET description = COALESCE(vp.description, pp.about_text)
FROM partner_pages pp
WHERE vp.id = pp.partner_id
  AND vp.description IS NULL
  AND pp.about_text IS NOT NULL;

-- Now drop the about_text column from partner_pages
ALTER TABLE partner_pages DROP COLUMN IF EXISTS about_text;
