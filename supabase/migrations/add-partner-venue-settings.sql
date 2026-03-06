-- Add venue settings to vendor_partners (for Winery type)
ALTER TABLE vendor_partners ADD COLUMN IF NOT EXISTS is_dog_friendly BOOLEAN DEFAULT false;
ALTER TABLE vendor_partners ADD COLUMN IF NOT EXISTS is_family_friendly BOOLEAN DEFAULT false;
ALTER TABLE vendor_partners ADD COLUMN IF NOT EXISTS allows_outside_food BOOLEAN DEFAULT false;
ALTER TABLE vendor_partners ADD COLUMN IF NOT EXISTS allows_pp_food_only BOOLEAN DEFAULT false;
