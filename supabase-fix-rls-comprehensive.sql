-- Comprehensive RLS fix for image uploads
-- Run this in Supabase SQL Editor

-- First, disable RLS temporarily
ALTER TABLE media DISABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies on media table
DROP POLICY IF EXISTS "Public media read access" ON media;
DROP POLICY IF EXISTS "Anyone can read media" ON media;
DROP POLICY IF EXISTS "Authenticated users can upload media" ON media;
DROP POLICY IF EXISTS "Authenticated users can insert media" ON media;
DROP POLICY IF EXISTS "Authenticated users can update media" ON media;
DROP POLICY IF EXISTS "Authenticated users can delete media" ON media;

-- Re-enable RLS
ALTER TABLE media ENABLE ROW LEVEL SECURITY;

-- Create new, permissive policies
-- Allow everyone to read (public images)
CREATE POLICY "media_select_policy"
ON media FOR SELECT
TO public
USING (true);

-- Allow authenticated users to insert
CREATE POLICY "media_insert_policy"
ON media FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow authenticated users to update their uploads
CREATE POLICY "media_update_policy"
ON media FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Allow authenticated users to delete
CREATE POLICY "media_delete_policy"
ON media FOR DELETE
TO authenticated
USING (true);

-- Verify the policies were created
SELECT schemaname, tablename, policyname, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'media';
