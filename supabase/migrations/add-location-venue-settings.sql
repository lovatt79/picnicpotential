-- Add venue/partner settings to location options
ALTER TABLE form_location_options ADD COLUMN IF NOT EXISTS is_dog_friendly BOOLEAN DEFAULT false;
ALTER TABLE form_location_options ADD COLUMN IF NOT EXISTS is_family_friendly BOOLEAN DEFAULT false;
ALTER TABLE form_location_options ADD COLUMN IF NOT EXISTS allows_outside_food BOOLEAN DEFAULT false;
ALTER TABLE form_location_options ADD COLUMN IF NOT EXISTS allows_pp_food_only BOOLEAN DEFAULT false;
