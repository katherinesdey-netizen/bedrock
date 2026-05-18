# Bedrock — iMac Handoff

## What is this?

**Bedrock** is Kat's personal daily planning app, built to replace Sunsama. It's a single-file React app with no build step, deployed on GitHub Pages, backed by Supabase.

---

## The repo

The app lives in a GitHub repo. To get it on the iMac, clone it:

```bash
git clone https://github.com/[your-username]/bedrock.git
# (check GitHub to confirm the exact repo URL)
```

Or if you already have it locally somewhere, just `git pull`.

The entire app is **`index.html`** in the repo root — one file, no npm, no build step needed.

---

## Stack

| Layer | Tech |
|---|---|
| UI | React 18 via CDN + Babel standalone (JSX compiled in browser) |
| Styles | Tailwind CSS via CDN Play CDN |
| Backend | Supabase (Postgres) |
| Deployment | GitHub Pages (main branch, root `/`) |

---

## Supabase credentials (already hardcoded in index.html)

- **URL:** `https://xoklkzvgilrpawbilxnc.supabase.co`
- **Anon key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhva2xrenZnaWxycGF3YmlseG5jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzMDMyMDMsImV4cCI6MjA4ODg3OTIwM30.MoStn-1gnyT2gdWqoA6F0h-xC5swROoU3dfk3HC444A`
- **Dashboard:** https://supabase.com/dashboard/project/xoklkzvgilrpawbilxnc

---

## Database schema summary

Two tables: **`tasks`** and **`reading_list`**.

### tasks (key columns)
| Column | Type | Notes |
|---|---|---|
| `id` | uuid | PK |
| `title` | text | required |
| `notes` | text | optional |
| `status` | text | `active` / `done` / `waiting` / `snoozed` |
| `priority` | int | `1` urgent / `2` normal / `3` low |
| `sort_order` | int | manual ordering within a list |
| `source` | text | where it came from (e.g. `digest`, `email`) |
| `source_account` | text | `personal` / `earlehouse` / `rise8` / `imessage` / `manual` |
| `due_date` | date | hard deadline |
| `scheduled_date` | date | **which day to show it in the week view** — see pending migration below |
| `tags` | text[] | e.g. `{action, financial, westerly}` |

### reading_list (key columns)
| Column | Notes |
|---|---|
| `title` | article/post title |
| `url` | optional |
| `source_account` | same enum as tasks |

---

## App structure (tabs)

**Week** — 7-column kanban: Mon, Tue, Wed, Thu, Fri, Weekend, Beyond
- Mobile: one day visible at a time, swipe left/right
- Desktop: all columns as horizontal scrollable kanban, drag-and-drop between columns
- Tasks sorted into columns by `scheduled_date`
- No `scheduled_date` → lands in **Beyond**
- Active day defaults to today's column on load

**Waiting** — tasks where `status = 'waiting'`

**Reading** — the `reading_list` table

---

## Source account color coding

| Account | Color |
|---|---|
| personal | blue |
| earlehouse | violet |
| rise8 | emerald |
| imessage | green |
| manual | zinc/gray |

---

## ⚠️ Pending — do these before working on the app

### 1. Run the SQL migration in Supabase

The week view requires a `scheduled_date` column that hasn't been added to the live database yet.

Go to: https://supabase.com/dashboard/project/xoklkzvgilrpawbilxnc/sql/new

Paste and run:
```sql
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS scheduled_date date;
CREATE INDEX IF NOT EXISTS tasks_scheduled_date_idx ON tasks (scheduled_date);
```

### 2. Push the latest index.html to GitHub

The week view rewrite hasn't been pushed yet. From the repo directory:
```bash
git add index.html supabase/add_scheduled_date.sql
git commit -m "feat: week kanban view — swipeable mobile, desktop columns, scheduled_date"
git push
```

GitHub Pages will rebuild automatically after push (takes ~1 min).

---

## SQL files in the repo

All under `supabase/`:

| File | Purpose |
|---|---|
| `schema.sql` | Full table definitions, triggers, RLS policies |
| `add_scheduled_date.sql` | ⚠️ Pending migration — adds `scheduled_date` column |
| `seed.sql` | 25 tasks + 10 reading list items from May 4 Daily Digest |
| `migrate_source_accounts.sql` | Renames `gmail` → `personal`, adds `imessage`/`manual` constraints |
| `deduplicate.sql` | Removes duplicate tasks/reading items (run if seed.sql gets run twice) |

---

## Local dev

No build step needed. Just open `index.html` in a browser directly, or:
```bash
cd bedrock
python3 -m http.server 8080
# then open http://localhost:8080
```

---

## Known things / gotchas

- Supabase URL + anon key are hardcoded in `index.html` — this is intentional for v1 single-user use. RLS policies use permissive anon access.
- `scheduled_date` ≠ `due_date`. Scheduled = when you plan to work on it. Due = hard deadline. Both fields exist on tasks.
- If tasks ever duplicate (happens if seed.sql runs twice), run `supabase/deduplicate.sql` in the SQL editor.
- The app is a PWA — it can be added to iPhone home screen from Safari for a native-feel experience.

---

## Continuing in Claude / Cowork on iMac

Start a new conversation with something like:

> "I'm continuing work on Bedrock, my personal planning app. Here's the handoff doc: [paste this file or attach it]. The repo is cloned at [path]. The pending migration still needs to be run in Supabase. Let's pick up from there."

Attach this file + the `index.html` to give Claude full context.
