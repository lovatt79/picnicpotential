-- Add hero image and subtitle to builder pages
ALTER TABLE builder_pages ADD COLUMN IF NOT EXISTS hero_image_id UUID REFERENCES media(id) ON DELETE SET NULL;
ALTER TABLE builder_pages ADD COLUMN IF NOT EXISTS hero_subtitle TEXT;
