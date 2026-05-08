-- ============================================================
-- Bedrock — Personal Daily Planning App
-- Supabase Schema v1
-- ============================================================

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ── tasks ────────────────────────────────────────────────────
create table if not exists tasks (
  id               uuid        primary key default uuid_generate_v4(),
  title            text        not null,
  notes            text,
  status           text        not null default 'active'
                               check (status in ('active','backlog','waiting','snoozed','delegated','someday','done')),
  priority         int         default 2
                               check (priority in (1, 2, 3)),
  sort_order       int         default 0,          -- used for manual drag-reorder in Today view
  source           text        check (source in ('email','manual','calendar','digest')),
  source_account   text        check (source_account in ('gmail','earlehouse','rise8')),
  source_email_id  text,                           -- reference to originating email thread
  waiting_on       text,                           -- person / team we're blocked on
  snooze_until     timestamptz,
  due_date         date,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  completed_at     timestamptz,
  tags             text[]      default '{}'::text[]
);

-- ── reading_list ─────────────────────────────────────────────
create table if not exists reading_list (
  id             uuid        primary key default uuid_generate_v4(),
  title          text,
  url            text,
  source_account text,
  created_at     timestamptz not null default now(),
  read_at        timestamptz             -- null = unread
);

-- ── updated_at trigger ───────────────────────────────────────
create or replace function update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists tasks_updated_at on tasks;
create trigger tasks_updated_at
  before update on tasks
  for each row
  execute function update_updated_at_column();

-- ── Row Level Security ────────────────────────────────────────
-- v1: single-user personal app — anon key has full access.
-- Tighten this when auth is added.

alter table tasks        enable row level security;
alter table reading_list enable row level security;

-- Drop existing policies if re-running
drop policy if exists "anon_all_tasks"        on tasks;
drop policy if exists "anon_all_reading_list" on reading_list;

create policy "anon_all_tasks"
  on tasks for all
  using (true)
  with check (true);

create policy "anon_all_reading_list"
  on reading_list for all
  using (true)
  with check (true);

-- ── Helpful indexes ───────────────────────────────────────────
create index if not exists tasks_status_idx      on tasks (status);
create index if not exists tasks_sort_order_idx  on tasks (sort_order);
create index if not exists tasks_due_date_idx    on tasks (due_date);
create index if not exists reading_list_read_idx on reading_list (read_at);
