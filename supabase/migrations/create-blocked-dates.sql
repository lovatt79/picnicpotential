-- =====================================================
-- Blocked Dates Table
-- Allows admin to block specific dates per form type
-- =====================================================

CREATE TABLE IF NOT EXISTS blocked_dates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL UNIQUE,
  affected_forms TEXT[] NOT NULL DEFAULT '{"general","proposal","wedding"}',
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE blocked_dates ENABLE ROW LEVEL SECURITY;

-- Public can read blocked dates (needed by forms)
CREATE POLICY "blocked_dates_public_read"
  ON blocked_dates FOR SELECT
  USING (true);

-- Only authenticated users (admins) can insert/update/delete
CREATE POLICY "blocked_dates_auth_insert"
  ON blocked_dates FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "blocked_dates_auth_update"
  ON blocked_dates FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "blocked_dates_auth_delete"
  ON blocked_dates FOR DELETE
  USING (auth.role() = 'authenticated');
