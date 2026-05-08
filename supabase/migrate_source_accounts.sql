-- ============================================================
-- Bedrock — Migration: update source_account values (fixed)
-- Run in: Supabase Dashboard → SQL Editor
-- ============================================================

-- 1. Drop the old constraint first
ALTER TABLE tasks        DROP CONSTRAINT IF EXISTS tasks_source_account_check;
ALTER TABLE reading_list DROP CONSTRAINT IF EXISTS reading_list_source_account_check;

-- 2. Rename data BEFORE adding the new constraint
UPDATE tasks        SET source_account = 'personal' WHERE source_account = 'gmail';
UPDATE reading_list SET source_account = 'personal' WHERE source_account = 'gmail';

-- 3. Now add the updated constraint
ALTER TABLE tasks
  ADD CONSTRAINT tasks_source_account_check
  CHECK (source_account IN ('personal', 'earlehouse', 'rise8', 'imessage', 'manual'));

ALTER TABLE reading_list
  ADD CONSTRAINT reading_list_source_account_check
  CHECK (source_account IN ('personal', 'earlehouse', 'rise8', 'imessage', 'manual'));
