-- Add image fields to about_content for the "Our Story" section image
ALTER TABLE about_content
  ADD COLUMN IF NOT EXISTS our_story_image_id UUID REFERENCES media(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS our_story_image_url TEXT;
