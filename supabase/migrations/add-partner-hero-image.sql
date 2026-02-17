-- Add hero image option to partner pages
DO $$
BEGIN
    -- Add hero_image_id column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'partner_pages' AND column_name = 'hero_image_id'
    ) THEN
        ALTER TABLE partner_pages ADD COLUMN hero_image_id UUID REFERENCES media(id) ON DELETE SET NULL;
    END IF;
END $$;

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_partner_pages_hero_image ON partner_pages(hero_image_id);
