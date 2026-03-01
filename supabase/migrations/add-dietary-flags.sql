-- Add is_vegan and is_gluten_free to food options
ALTER TABLE form_food_options ADD COLUMN IF NOT EXISTS is_vegan BOOLEAN DEFAULT false;
ALTER TABLE form_food_options ADD COLUMN IF NOT EXISTS is_gluten_free BOOLEAN DEFAULT false;

-- Add is_gluten_free to dessert options (is_vegan already exists)
ALTER TABLE form_dessert_options ADD COLUMN IF NOT EXISTS is_gluten_free BOOLEAN DEFAULT false;
