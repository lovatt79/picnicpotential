-- Ensure all form option tables exist before adding columns
-- This handles cases where the base tables weren't created yet

-- Create form_occasion_options if it doesn't exist
CREATE TABLE IF NOT EXISTS form_occasion_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label VARCHAR(255) NOT NULL UNIQUE,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create form_attribution_options if it doesn't exist
CREATE TABLE IF NOT EXISTS form_attribution_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label VARCHAR(255) NOT NULL UNIQUE,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add value column to form_event_types if it doesn't exist
DO $migration$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'form_event_types' AND column_name = 'value') THEN
    ALTER TABLE form_event_types ADD COLUMN value VARCHAR(255);
    -- Populate value from label for existing records
    UPDATE form_event_types SET value = LOWER(REPLACE(label, ' ', '-')) WHERE value IS NULL;
    -- Make it unique and not null
    ALTER TABLE form_event_types ALTER COLUMN value SET NOT NULL;

    -- Add unique constraint only if it doesn't exist
    IF NOT EXISTS (
      SELECT 1 FROM pg_constraint
      WHERE conname = 'form_event_types_value_unique'
    ) THEN
      ALTER TABLE form_event_types ADD CONSTRAINT form_event_types_value_unique UNIQUE (value);
    END IF;
  END IF;
END $migration$;

-- Add columns to form_food_options (if they don't exist)
DO $migration$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'form_food_options' AND column_name = 'price') THEN
    ALTER TABLE form_food_options ADD COLUMN price NUMERIC(10,2);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'form_food_options' AND column_name = 'price_unit') THEN
    ALTER TABLE form_food_options ADD COLUMN price_unit VARCHAR(50);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'form_food_options' AND column_name = 'min_quantity') THEN
    ALTER TABLE form_food_options ADD COLUMN min_quantity INTEGER;
  END IF;
END $migration$;

-- Add columns to form_dessert_options (if they don't exist)
DO $migration$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'form_dessert_options' AND column_name = 'price') THEN
    ALTER TABLE form_dessert_options ADD COLUMN price NUMERIC(10,2);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'form_dessert_options' AND column_name = 'price_unit') THEN
    ALTER TABLE form_dessert_options ADD COLUMN price_unit VARCHAR(50);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'form_dessert_options' AND column_name = 'min_quantity') THEN
    ALTER TABLE form_dessert_options ADD COLUMN min_quantity INTEGER;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'form_dessert_options' AND column_name = 'is_vegan') THEN
    ALTER TABLE form_dessert_options ADD COLUMN is_vegan BOOLEAN DEFAULT false;
  END IF;
END $migration$;

-- Add columns to form_addon_options (if they don't exist)
DO $migration$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'form_addon_options' AND column_name = 'price') THEN
    ALTER TABLE form_addon_options ADD COLUMN price NUMERIC(10,2);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'form_addon_options' AND column_name = 'price_unit') THEN
    ALTER TABLE form_addon_options ADD COLUMN price_unit VARCHAR(50);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'form_addon_options' AND column_name = 'category') THEN
    ALTER TABLE form_addon_options ADD COLUMN category VARCHAR(100);
  END IF;
END $migration$;

-- Disable RLS for development (if not already disabled)
ALTER TABLE form_occasion_options DISABLE ROW LEVEL SECURITY;
ALTER TABLE form_attribution_options DISABLE ROW LEVEL SECURITY;
