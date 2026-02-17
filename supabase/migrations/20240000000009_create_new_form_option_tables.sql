-- Create Time Add-on Options Table
CREATE TABLE IF NOT EXISTS form_time_addon_options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  label VARCHAR(255) NOT NULL,
  hours INTEGER NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Location Options Table
CREATE TABLE IF NOT EXISTS form_location_options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  label VARCHAR(255) NOT NULL,
  location_type VARCHAR(50),
  city VARCHAR(100),
  notes TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS (if not already enabled)
DO $migration$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables
    WHERE schemaname = 'public'
    AND tablename = 'form_time_addon_options'
    AND rowsecurity = true
  ) THEN
    ALTER TABLE form_time_addon_options ENABLE ROW LEVEL SECURITY;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_tables
    WHERE schemaname = 'public'
    AND tablename = 'form_location_options'
    AND rowsecurity = true
  ) THEN
    ALTER TABLE form_location_options ENABLE ROW LEVEL SECURITY;
  END IF;
END $migration$;

-- Create policies if they don't exist
DO $migration$
BEGIN
  -- Time addon policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'form_time_addon_options'
    AND policyname = 'Allow public read access to time addon options'
  ) THEN
    CREATE POLICY "Allow public read access to time addon options"
      ON form_time_addon_options FOR SELECT
      TO public
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'form_time_addon_options'
    AND policyname = 'Allow authenticated full access to time addon options'
  ) THEN
    CREATE POLICY "Allow authenticated full access to time addon options"
      ON form_time_addon_options FOR ALL
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;

  -- Location policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'form_location_options'
    AND policyname = 'Allow public read access to location options'
  ) THEN
    CREATE POLICY "Allow public read access to location options"
      ON form_location_options FOR SELECT
      TO public
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'form_location_options'
    AND policyname = 'Allow authenticated full access to location options'
  ) THEN
    CREATE POLICY "Allow authenticated full access to location options"
      ON form_location_options FOR ALL
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;
END $migration$;
