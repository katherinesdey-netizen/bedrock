-- ============================================================
-- Bedrock — Remove duplicate tasks and reading list items
-- Keeps the earliest-created copy, deletes the rest
-- Run in: Supabase Dashboard → SQL Editor
-- ============================================================

-- Deduplicate tasks (keep oldest by created_at for each title)
DELETE FROM tasks
WHERE id IN (
  SELECT id FROM (
    SELECT id,
           ROW_NUMBER() OVER (PARTITION BY title ORDER BY created_at ASC) AS rn
    FROM tasks
  ) t
  WHERE rn > 1
);

-- Deduplicate reading_list (keep oldest by created_at for each title)
DELETE FROM reading_list
WHERE id IN (
  SELECT id FROM (
    SELECT id,
           ROW_NUMBER() OVER (PARTITION BY title ORDER BY created_at ASC) AS rn
    FROM reading_list
  ) t
  WHERE rn > 1
);
