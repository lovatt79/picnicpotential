-- Fix RLS policies for media uploads
-- Run this in Supabase SQL Editor

-- Drop existing policies
DROP POLICY IF EXISTS "Public media read access" ON media;
DROP POLICY IF EXISTS "Authenticated users can upload media" ON media;
DROP POLICY IF EXISTS "Authenticated users can update media" ON media;
DROP POLICY IF EXISTS "Authenticated users can delete media" ON media;

-- Recreate with correct policies
CREATE POLICY "Anyone can read media"
ON media FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can insert media"
ON media FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update media"
ON media FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete media"
ON media FOR DELETE
TO authenticated
USING (true);

-- Also ensure RLS is enabled
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
