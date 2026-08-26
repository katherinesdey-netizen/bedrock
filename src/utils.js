export function dateStr(d) {
  return d ? d.toISOString().split('T')[0] : null;
}

export function todayStr() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return dateStr(d);
}

export function buildCols() {
  const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const DAY_SHORT = ['Su', 'M', 'Tu', 'W', 'Th', 'F', 'Sa'];
  const base = new Date();
  base.setHours(0, 0, 0, 0);
  const dayCols = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    const dow = d.getDay();
    const ds = dateStr(d);
    const isWeekend = dow === 0 || dow === 6;
    return {
      id:        ds,
      label:     i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : `${DAY_NAMES[dow]} ${d.getDate()}`,
      short:     i === 0 ? 'Tdy' : DAY_SHORT[dow],
      dateNum:   d.getDate(),
      date:      d,
      isToday:   i === 0,
      isWeekend,
    };
  });
  return [
    { id: 'inbox', isInbox: true, label: 'To Process', short: '≡' },
    ...dayCols,
  ];
}

export function colDate(colId) {
  return colId === 'inbox' ? null : colId;
}

export function taskColId(task, cols) {
  if (!task.scheduled_date) return 'inbox';
  const today = cols.find(c => c.isToday)?.id;
  if (today && task.scheduled_date < today) return today;
  if (cols.find(c => !c.isInbox && c.id === task.scheduled_date)) return task.scheduled_date;
  return 'inbox';
}

export function fmtDue(d) {
  if (!d) return null;
  const dt = new Date(d + 'T00:00:00');
  const today = new Date();
  const tom = new Date();
  tom.setDate(today.getDate() + 1);
  if (dt.toDateString() === today.toDateString()) return { str: 'Today',    over: false };
  if (dt.toDateString() === tom.toDateString())   return { str: 'Tomorrow', over: false };
  return { str: dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), over: dt < today };
}

export function fmtHeader() {
  return new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}
