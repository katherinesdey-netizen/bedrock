// Bedrock Today - Scriptable widget
// Install: paste into Scriptable app, add medium home screen widget
// Tap widget opens the Bedrock web app

const SUPABASE_URL = 'https://xoklkzvgilrpawbilxnc.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhva2xrenZnaWxycGF3YmlseG5jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzMDMyMDMsImV4cCI6MjA4ODg3OTIwM30.MoStn-1gnyT2gdWqoA6F0h-xC5swROoU3dfk3HC444A';
const APP_URL   = 'https://katherinesdey-netizen.github.io/bedrock/';

const today = new Date().toISOString().slice(0, 10);

const COLORS = {
  bg:       new Color('#f5f0eb'),
  header:   new Color('#292524'),
  text:     new Color('#44403c'),
  subtext:  new Color('#a8a29e'),
  pri1:     new Color('#f87171'),
  pri2:     new Color('#fbbf24'),
  pri3:     new Color('#d6d3d1'),
  inboxDot: new Color('#cbd5e1'),
};

function headers() {
  return { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}` };
}

async function fetchTasks(filter) {
  const url = `${SUPABASE_URL}/rest/v1/tasks?select=title,priority,status&${filter}&order=priority.asc.nullslast`;
  const req = new Request(url);
  req.headers = headers();
  try { return await req.loadJSON(); } catch { return []; }
}

// Fetch today + inbox in parallel
const [todayTasks, inboxTasks] = await Promise.all([
  fetchTasks(`scheduled_date=eq.${today}&status=neq.done&status=neq.waiting`),
  fetchTasks(`scheduled_date=is.null&status=neq.done&status=neq.waiting`),
]);

// Cap: up to 5 today, fill remaining to 7 total with inbox
const MAX = 7;
const todaySlice = todayTasks.slice(0, 5);
const inboxSlice = inboxTasks.slice(0, MAX - todaySlice.length);
const allTasks   = [...todaySlice, ...inboxSlice];

// Build widget
const w = new ListWidget();
w.backgroundColor = COLORS.bg;
w.url = APP_URL;
w.setPadding(14, 16, 14, 16);

// Header row
const hStack = w.addStack();
hStack.layoutHorizontally();
hStack.centerAlignContent();

const dayFmt = new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
const hText  = hStack.addText('Bedrock');
hText.font   = Font.boldSystemFont(13);
hText.textColor = COLORS.header;

hStack.addSpacer();

const countText = hStack.addText(`${todayTasks.length} today · ${inboxTasks.length} inbox`);
countText.font = Font.systemFont(10);
countText.textColor = COLORS.subtext;

w.addSpacer(8);

if (allTasks.length === 0) {
  const empty = w.addText('All clear ✓');
  empty.font = Font.mediumSystemFont(13);
  empty.textColor = COLORS.subtext;
} else {
  const isInboxTask = new Set(inboxSlice.map((_, i) => todaySlice.length + i));

  for (let i = 0; i < allTasks.length; i++) {
    const task = allTasks[i];
    const row  = w.addStack();
    row.layoutHorizontally();
    row.centerAlignContent();
    row.spacing = 6;

    // Priority dot
    const dotColor = task.priority === 1 ? COLORS.pri1
                   : task.priority === 3 ? COLORS.pri3
                   : COLORS.pri2;
    const dot = row.addText('●');
    dot.font = Font.systemFont(7);
    dot.textColor = isInboxTask.has(i) ? COLORS.inboxDot : dotColor;

    // Title
    const label = row.addText(task.title);
    label.font = Font.systemFont(12);
    label.textColor = isInboxTask.has(i) ? COLORS.subtext : COLORS.text;
    label.lineLimit = 1;

    if (i < allTasks.length - 1) w.addSpacer(4);
  }
}

Script.setWidget(w);
if (config.runsInApp) await w.presentMedium();
