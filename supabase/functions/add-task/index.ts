import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const ALLOWED_TOKEN = Deno.env.get('ADD_TASK_TOKEN');

Deno.serve(async (req) => {
  // Auth
  const auth = req.headers.get('Authorization');
  if (!ALLOWED_TOKEN || auth !== `Bearer ${ALLOWED_TOKEN}`) {
    return json({ error: 'Unauthorized' }, 401);
  }

  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  let body: Record<string, string>;
  try {
    body = await req.json();
  } catch {
    return json({ error: 'Invalid JSON' }, 400);
  }

  const { title, area, scheduled_date, source_account, notes } = body;

  if (!title?.trim()) {
    return json({ error: 'title is required' }, 400);
  }

  const db = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  // Dedup: existing non-done task with same title (case-insensitive)
  const { data: existing } = await db
    .from('tasks')
    .select('id, title, status')
    .ilike('title', title.trim())
    .neq('status', 'done')
    .maybeSingle();

  if (existing) {
    return json({ status: 'duplicate', task: existing, message: `Already exists: "${existing.title}"` }, 200);
  }

  // Resolve area name → area_id (matches on name or color_key, case-insensitive)
  let area_id = null;
  if (area) {
    const { data: areaRow } = await db
      .from('areas')
      .select('id, name')
      .or(`name.ilike.%${area}%,color_key.ilike.%${area}%`)
      .limit(1)
      .maybeSingle();
    area_id = areaRow?.id ?? null;
  }

  const today = new Date().toISOString().slice(0, 10);

  const { data: task, error } = await db
    .from('tasks')
    .insert([{
      title:          title.trim(),
      area_id,
      scheduled_date: scheduled_date ?? today,
      source_account: source_account ?? 'instinct',
      notes:          notes?.trim() ?? null,
      status:         'active',
      priority:       2,
    }])
    .select()
    .single();

  if (error) {
    return json({ error: error.message }, 500);
  }

  return json({ status: 'created', task }, 201);
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
