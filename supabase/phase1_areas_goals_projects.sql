-- Phase 1: Areas, Goals, Projects
-- Run in Supabase Dashboard → SQL Editor

-- ── Areas ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS areas (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name           text    NOT NULL,
  color_key      text    NOT NULL,
  capacity_hours int2    NOT NULL DEFAULT 5,
  sort_order     int2    NOT NULL DEFAULT 0,
  created_at     timestamptz DEFAULT now()
);

ALTER TABLE areas ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon all areas" ON areas;
CREATE POLICY "anon all areas" ON areas FOR ALL TO anon USING (true) WITH CHECK (true);

-- Seed the six areas (idempotent)
INSERT INTO areas (name, color_key, capacity_hours, sort_order) VALUES
  ('Personal',            'personal',   12, 1),
  ('Earle House',         'earlehouse', 20, 2),
  ('Misquamicut Groove',  'groove',      5, 3),
  ('Alpenborg',           'alpenborg',   4, 4),
  ('Fox Point LL',        'fpll',        3, 5),
  ('Family Finance',      'finance',     2, 6)
ON CONFLICT DO NOTHING;

-- ── Goals ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS goals (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  area_id     uuid REFERENCES areas(id) ON DELETE CASCADE,
  title       text NOT NULL,
  description text,
  target_date date,
  status      text NOT NULL DEFAULT 'active', -- active | paused | complete
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon all goals" ON goals;
CREATE POLICY "anon all goals" ON goals FOR ALL TO anon USING (true) WITH CHECK (true);

-- ── Projects ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS projects (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  area_id    uuid REFERENCES areas(id) ON DELETE CASCADE,
  goal_id    uuid REFERENCES goals(id) ON DELETE SET NULL,
  title      text NOT NULL,
  status     text NOT NULL DEFAULT 'active', -- active | on-hold | someday | complete
  priority   int2 DEFAULT 2,                 -- 1 High | 2 Med | 3 Low
  notes      text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon all projects" ON projects;
CREATE POLICY "anon all projects" ON projects FOR ALL TO anon USING (true) WITH CHECK (true);

-- ── Tasks additions ───────────────────────────────────────────
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS area_id    uuid REFERENCES areas(id)    ON DELETE SET NULL;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS project_id uuid REFERENCES projects(id) ON DELETE SET NULL;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS effort     int2; -- 1 S (~0.5h) | 2 M (~1h) | 3 L (~2h)

CREATE INDEX IF NOT EXISTS tasks_area_id_idx    ON tasks (area_id);
CREATE INDEX IF NOT EXISTS tasks_project_id_idx ON tasks (project_id);
