// Bedrock Today - Scriptable widget (iOS 17+)
// Tap a task row to open Bedrock. Tap the check to mark it done.

const SUPABASE_URL = 'https://xoklkzvgilrpawbilxnc.supabase.co';
const ANON_KEY     = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhva2xrenZnaWxycGF3YmlseG5jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzMDMyMDMsImV4cCI6MjA4ODg3OTIwM30.MoStn-1gnyT2gdWqoA6F0h-xC5swROoU3dfk3HC444A';
const APP_URL      = 'https://katherinesdey-netizen.github.io/bedrock/';
const SCRIPT_NAME  = encodeURIComponent(Script.name());

const today = new Date().toISOString().slice(0, 10);

const C = {
  bg:       new Color('f5f0eb'),
  header:   new Color('292524'),
  text:     new Color('44403c'),
  subtext:  new Color('a8a29e'),
  check:    new Color('9ca3af'),
  pri1:     new Color('f87171'),
  pri2:     new Color('fbbf24'),
  pri3:     new Color('d6d3d1'),
  inbox:    new Color('cbd5e1'),
};

function apiHeaders(extra) {
  return Object.assign({ apikey: ANON_KEY, Authorization: 'Bearer ' + ANON_KEY }, extra || {});
}

async function fetchTasks(filter) {
  const url = SUPABASE_URL + '/rest/v1/tasks?select=id,title,priority&' + filter + '&order=priority.asc.nullslast';
  const req = new Request(url);
  req.headers = apiHeaders();
  try { return await req.loadJSON(); } catch(e) { return []; }
}

async function buildWidget() {
  const [todayTasks, inboxTasks] = await Promise.all([
    fetchTasks('scheduled_date=eq.' + today + '&status=neq.done&status=neq.waiting'),
    fetchTasks('scheduled_date=is.null&status=neq.done&status=neq.waiting'),
  ]);

  const todaySlice = todayTasks.slice(0, 5);
  const inboxSlice = inboxTasks.slice(0, 7 - todaySlice.length);
  const all        = todaySlice.concat(inboxSlice);
  const inboxStart = todaySlice.length;

  const w = new ListWidget();
  w.backgroundColor = C.bg;
  w.setPadding(14, 16, 14, 12);
  w.spacing = 0;

  // Header
  const hRow = w.addStack();
  hRow.layoutHorizontally();
  hRow.centerAlignContent();
  hRow.url = APP_URL;
  const hText = hRow.addText('Bedrock');
  hText.font = Font.boldSystemFont(15);
  hText.textColor = C.header;
  hRow.addSpacer();
  const meta = hRow.addText(todayTasks.length + ' today  ' + inboxTasks.length + ' inbox');
  meta.font = Font.systemFont(12);
  meta.textColor = C.subtext;

  w.addSpacer(8);

  if (all.length === 0) {
    const empty = w.addText('All clear');
    empty.font = Font.mediumSystemFont(15);
    empty.textColor = C.subtext;
    w.addSpacer();
    return w;
  }

  for (let i = 0; i < all.length; i++) {
    const task    = all[i];
    const isInbox = i >= inboxStart;
    const dotCol  = isInbox ? C.inbox : task.priority === 1 ? C.pri1 : task.priority === 3 ? C.pri3 : C.pri2;

    const row = w.addStack();
    row.layoutHorizontally();
    row.centerAlignContent();
    row.spacing = 6;
    row.url = APP_URL;

    const dot = row.addText('*');
    dot.font = Font.boldSystemFont(11);
    dot.textColor = dotCol;

    const label = row.addText(task.title);
    label.font = Font.systemFont(14);
    label.textColor = isInbox ? C.subtext : C.text;
    label.lineLimit = 1;

    if (i < all.length - 1) w.addSpacer(5);
  }

  w.addSpacer();
  return w;
}

// Handle mark-done callback
const param = args.widgetParameter || '';
if (param.startsWith('done:')) {
  const id = param.slice(5);
  const req = new Request(SUPABASE_URL + '/rest/v1/tasks?id=eq.' + id);
  req.method = 'PATCH';
  req.headers = apiHeaders({ 'Content-Type': 'application/json', Prefer: 'return=minimal' });
  req.body = JSON.stringify({ status: 'done', completed_at: new Date().toISOString() });
  try { await req.load(); } catch(e) {}
}

const widget = await buildWidget();
Script.setWidget(widget);
if (config.runsInApp) await widget.presentMedium();
