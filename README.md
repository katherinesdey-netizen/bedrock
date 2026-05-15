# Bedrock

A personal daily planning app built to replace Sunsama. Clean, fast, mobile-first, dark mode.

**Live app:** https://katherinesdey-netizen.github.io/bedrock/

---

## What it does

- **Today** — active priority tasks, drag to reorder
- **Backlog** — everything else, sorted by priority
- **Waiting** — tasks blocked on someone else
- **Reading List** — articles and links to read later

Each task shows source badges (Gmail / Earlehouse / Rise8), due dates, priority, and who you're waiting on. Tap any task to expand quick actions: done, move to backlog, move to today, waiting, snooze to tomorrow.

---

## Stack

- React 18 via CDN (no build step)
- Tailwind CSS via CDN
- Supabase JS v2 for the database
- GitHub Pages for hosting

---

## Database setup

Run `supabase/schema.sql` in your Supabase project's SQL editor once. It creates the `tasks` and `reading_list` tables, an `updated_at` trigger, and permissive RLS policies for the anon key.

---

## Deploy

The app is a single `index.html` — GitHub Pages serves it directly from the `main` branch root.

1. Push to `main`
2. Go to repo Settings → Pages → Source: main branch, root `/`
3. Done — live at `https://[username].github.io/bedrock/`

---

## Future (v2+)

- Auth via Supabase magic link
- Gmail integration to auto-create tasks from emails
- Calendar sync for due dates
- Keyboard shortcuts
- Per-task edit modal
- Someday / snoozed views
- Tags filter
# trip-ops
