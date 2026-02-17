-- Add image_id columns to seating_options and vendor_partners tables
-- This enables ImageUpload component integration with the media table

-- Add image_id to seating_options
ALTER TABLE seating_options
  ADD COLUMN IF NOT EXISTS image_id UUID REFERENCES media(id) ON DELETE SET NULL;

-- Add image_id to vendor_partners
ALTER TABLE vendor_partners
  ADD COLUMN IF NOT EXISTS logo_id UUID REFERENCES media(id) ON DELETE SET NULL;

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_seating_options_image_id ON seating_options(image_id);
CREATE INDEX IF NOT EXISTS idx_vendor_partners_logo_id ON vendor_partners(logo_id);
