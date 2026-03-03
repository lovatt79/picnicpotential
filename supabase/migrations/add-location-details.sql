-- Add location_details column to form_submissions and proposal_submissions
-- This stores address/venue details when "Private Home/Backyard" or "Other Venue" is selected

ALTER TABLE form_submissions ADD COLUMN IF NOT EXISTS location_details TEXT;
ALTER TABLE proposal_submissions ADD COLUMN IF NOT EXISTS location_details TEXT;
