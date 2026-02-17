-- Add image_id columns to seating_options and vendor_partners tables
-- This allows using the media table for image management instead of URL strings

-- Add image_id to seating_options
ALTER TABLE seating_options ADD COLUMN IF NOT EXISTS image_id UUID REFERENCES media(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_seating_options_image_id ON seating_options(image_id);

-- Add logo_id to vendor_partners (in addition to logo_url for backwards compatibility)
ALTER TABLE vendor_partners ADD COLUMN IF NOT EXISTS logo_id UUID REFERENCES media(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_vendor_partners_logo_id ON vendor_partners(logo_id);
