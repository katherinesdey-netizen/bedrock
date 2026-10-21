// Bedrock Today — Scriptable widget (iOS 17+)
// Install: paste into Scriptable app, add medium home screen widget
// Tap ✓ to complete a task in place; tap title area to open Bedrock

const SUPABASE_URL  = 'https://xoklkzvgilrpawbilxnc.supabase.co';
const ANON_KEY      = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhva2xrenZnaWxycGF3YmlseG5jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzMDMyMDMsImV4cCI6MjA4ODg3OTIwM30.MoStn-1gnyT2gdWqoA6F0h-xC5swROoU3dfk3HC444A';
const APP_URL       = 'https://katherinesdey-netizen.github.io/bedrock/';
const SCRIPT_NAME   = encodeURIComponent(Script.name());

const today = new Date().toISOString().slice(0, 10);

const COLORS = {
  bg:       new Color('#f5f0eb'),
  header:   new Color('#292524'),
  text:     new Color('#44403c'),
  subtext:  new Color('#a8a29e'),
  check:    new Color('#6b7280'),
  pri1:     new Color('#f87171'),
  pri2:     new Color('#fbbf24'),
  pri3:     new Color('#d6d3d1'),
  inboxDot: new Color('#cbd5e1'),
};

function apiHeaders(extra = {}) {
  return { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}`, ...extra };
}

// ── Handle mark-done callback ────────────────────────────────────────────────
const param = args.widgetParameter || '';
if (param.startsWith('done:')) {
  const id = param.slice(5);
  const req = new Request(`${SUPABASE_URL}/rest/v1/tasks?id=eq.${id}`);
  req.method = 'PATCH';
  req.headers = apiHeaders({ 'Content-Type': 'application/json', Prefer: 'return=minimal' });
  req.body = JSON.stringify({ status: 'done', completed_at: new Date().toISOString() });
  try { await req.load(); } catch {}
  Script.setWidget(await buildWidget());
  Script.complete();
  return;
}

// ── Fetch tasks ──────────────────────────────────────────────────────────────
async function fetchTasks(filter) {
  const url = `${SUPABASE_URL}/rest/v1/tasks?select=id,title,priority&${filter}&order=priority.asc.nullslast`;
  const req = new Request(url);
  req.headers = apiHeaders();
  try { return await req.loadJSON(); } catch { return []; }
}

// ── Build widget ─────────────────────────────────────────────────────────────
async function buildWidget() {
  const [todayTasks, inboxTasks] = await Promise.all([
    fetchTasks(`scheduled_date=eq.${today}&status=neq.done&status=neq.waiting`),
    fetchTasks(`scheduled_date=is.null&status=neq.done&status=neq.waiting`),
  ]);

  const MAX         = 7;
  const todaySlice  = todayTasks.slice(0, 5);
  const inboxSlice  = inboxTasks.slice(0, MAX - todaySlice.length);
  const allTasks    = [...todaySlice, ...inboxSlice];
  const inboxStart  = todaySlice.length;

  const w = new ListWidget();
  w.backgroundColor = COLORS.bg;
  w.url = APP_URL;
  w.setPadding(14, 16, 14, 12);

  // Header
  const hRow = w.addStack();
  hRow.layoutHorizontally();
  hRow.centerAlignContent();
  const hText = hRow.addText('Bedrock');
  hText.font = Font.boldSystemFont(13);
  hText.textColor = COLORS.header;
  hRow.addSpacer();
  const meta = hRow.addText(`${todayTasks.length} today · ${inboxTasks.length} inbox`);
  meta.font = Font.systemFont(10);
  meta.textColor = COLORS.subtext;

  w.addSpacer(8);

  if (allTasks.length === 0) {
    const empty = w.addText('All clear ✓');
    empty.font = Font.mediumSystemFont(13);
    empty.textColor = COLORS.subtext;
    return w;
  }

  for (let i = 0; i < allTasks.length; i++) {
    const task   = allTasks[i];
    const isInbox = i >= inboxStart;
    const dotColor = isInbox ? COLORS.inboxDot
                   : task.priority === 1 ? COLORS.pri1
                   : task.priority === 3 ? COLORS.pri3
                   : COLORS.pri2;

    const row = w.addStack();
    row.layoutHorizontally();
    row.centerAlignContent();
    row.spacing = 6;
    row.url = APP_URL; // tapping task text opens app

    // Priority dot
    const dot = row.addText('●');
    dot.font = Font.systemFont(7);
    dot.textColor = dotColor;

    // Title
    const label = row.addText(task.title);
    label.font = Font.systemFont(12);
    label.textColor = isInbox ? COLORS.subtext : COLORS.text;
    label.lineLimit = 1;

    row.addSpacer();

    // ✓ button — tapping marks done
    const checkStack = row.addStack();
    checkStack.setPadding(2, 8, 2, 0);
    checkStack.url = `scriptable:///run?scriptName=${SCRIPT_NAME}&widgetParameter=${encodeURIComponent('done:' + task.id)}`;
    const checkText = checkStack.addText('✓');
    checkText.font = Font.systemFont(12);
    checkText.textColor = COLORS.check;

    if (i < allTasks.length - 1) w.addSpacer(4);
  }

  return w;
}

// ── Run ──────────────────────────────────────────────────────────────────────
const widget = await buildWidget();
Script.setWidget(widget);
if (config.runsInApp) await widget.presentMedium();
