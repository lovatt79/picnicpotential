-- Add image_id column to services table
ALTER TABLE services ADD COLUMN IF NOT EXISTS image_id UUID REFERENCES media(id) ON DELETE SET NULL;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_services_image_id ON services(image_id);

-- Optionally migrate existing image_url data to media table (if needed)
-- This would require manual work to upload images and create media records
