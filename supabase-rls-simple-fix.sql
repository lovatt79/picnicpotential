-- Simple RLS fix - Allow anon role to insert into media
-- The browser client uses the anon key, not authenticated role
-- Run this in Supabase SQL Editor

-- Disable RLS
ALTER TABLE media DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Public media read access" ON media;
DROP POLICY IF EXISTS "Anyone can read media" ON media;
DROP POLICY IF EXISTS "Authenticated users can upload media" ON media;
DROP POLICY IF EXISTS "Authenticated users can insert media" ON media;
DROP POLICY IF EXISTS "Authenticated users can update media" ON media;
DROP POLICY IF EXISTS "Authenticated users can delete media" ON media;
DROP POLICY IF EXISTS "media_select_policy" ON media;
DROP POLICY IF EXISTS "media_insert_policy" ON media;
DROP POLICY IF EXISTS "media_update_policy" ON media;
DROP POLICY IF EXISTS "media_delete_policy" ON media;

-- Re-enable RLS
ALTER TABLE media ENABLE ROW LEVEL SECURITY;

-- Allow public (anon + authenticated) to read
CREATE POLICY "allow_public_read"
ON media FOR SELECT
USING (true);

-- Allow public (anon + authenticated) to insert
-- This is key - the browser client uses anon role
CREATE POLICY "allow_public_insert"
ON media FOR INSERT
WITH CHECK (true);

-- Allow public to update
CREATE POLICY "allow_public_update"
ON media FOR UPDATE
USING (true)
WITH CHECK (true);

-- Allow public to delete
CREATE POLICY "allow_public_delete"
ON media FOR DELETE
USING (true);

-- Verify
SELECT tablename, policyname, roles, cmd
FROM pg_policies
WHERE tablename = 'media';
