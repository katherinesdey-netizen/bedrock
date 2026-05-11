-- Bedrock — add scheduled_date column
-- Run in: Supabase Dashboard → SQL Editor

ALTER TABLE tasks ADD COLUMN IF NOT EXISTS scheduled_date date;
CREATE INDEX IF NOT EXISTS tasks_scheduled_date_idx ON tasks (scheduled_date);
