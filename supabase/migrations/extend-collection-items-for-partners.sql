-- Extend collection_page_items to support both services and partners

-- Add item_type column (defaults to 'service' for all existing rows)
ALTER TABLE collection_page_items
  ADD COLUMN IF NOT EXISTS item_type TEXT NOT NULL DEFAULT 'service';

-- Add nullable partner_id column
ALTER TABLE collection_page_items
  ADD COLUMN IF NOT EXISTS partner_id UUID REFERENCES vendor_partners(id) ON DELETE CASCADE;

-- Make service_id nullable (was NOT NULL)
ALTER TABLE collection_page_items
  ALTER COLUMN service_id DROP NOT NULL;

-- Drop the old unique constraint and add partial unique indexes
ALTER TABLE collection_page_items
  DROP CONSTRAINT IF EXISTS collection_page_items_collection_page_id_service_id_key;

CREATE UNIQUE INDEX IF NOT EXISTS uq_collection_item_service
  ON collection_page_items(collection_page_id, service_id)
  WHERE service_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS uq_collection_item_partner
  ON collection_page_items(collection_page_id, partner_id)
  WHERE partner_id IS NOT NULL;

-- Ensure exactly one of service_id/partner_id is set, matching item_type
ALTER TABLE collection_page_items
  ADD CONSTRAINT chk_item_type_ref CHECK (
    (item_type = 'service' AND service_id IS NOT NULL AND partner_id IS NULL) OR
    (item_type = 'partner' AND partner_id IS NOT NULL AND service_id IS NULL)
  );

-- Index on partner_id for join performance
CREATE INDEX IF NOT EXISTS idx_collection_page_items_partner
  ON collection_page_items(partner_id);
