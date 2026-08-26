import { useState, useEffect, useCallback, useMemo } from 'react';
import { db } from './supabase';
import { buildCols, colDate, todayStr, fmtHeader } from './utils';
import { Ic } from './components/Icons';
import { TaskCard } from './components/TaskCard';
import { ReadingCard } from './components/ReadingCard';
import { AddTaskModal } from './components/AddTaskModal';
import { WeekView } from './components/WeekView';
import { SectionHead, Empty } from './components/SectionHead';

export default function App() {
  const [tasks,     setTasks]     = useState([]);
  const [reading,   setReading]   = useState([]);
  const [areas,     setAreas]     = useState([]);
  const [tab,       setTab]       = useState('week');
  const [activeDay, setActiveDay] = useState(1); // 0=inbox, 1=today
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);
  const [showAdd,   setShowAdd]   = useState(false);

  // cols is stable for the session — rolling 14 days from load time
  const cols = useMemo(() => buildCols(), []);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const today = todayStr();
      const [{ data: t, error: te }, { data: r, error: re }, { data: a, error: ae }] = await Promise.all([
        db.from('tasks').select('*').neq('status', 'done').order('sort_order', { ascending: true, nullsFirst: false }),
        db.from('reading_list').select('*').order('created_at', { ascending: false }),
        db.from('areas').select('*').order('sort_order', { ascending: true }),
      ]);
      if (te) throw te;
      if (re) throw re;
      if (ae) throw ae;

      // Auto-move past tasks to today
      const pastTasks = (t || []).filter(task =>
        task.scheduled_date && task.scheduled_date < today && task.status !== 'waiting'
      );
      if (pastTasks.length > 0) {
        await Promise.all(pastTasks.map(task =>
          db.from('tasks').update({ scheduled_date: today }).eq('id', task.id)
        ));
      }
      const merged = (t || []).map(task =>
        pastTasks.find(pt => pt.id === task.id) ? { ...task, scheduled_date: today } : task
      );
      setTasks(merged);
      setReading(r || []);
      setAreas(a || []);
    } catch (e) {
      setError(e.message || 'Connection error.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const updateTask = useCallback(async (id, updates) => {
    setTasks(p => p.map(t => t.id === id ? { ...t, ...updates } : t));
    const { error } = await db.from('tasks').update(updates).eq('id', id);
    if (error) load();
  }, [load]);

  const markDone = useCallback(async (id) => {
    setTasks(p => p.filter(t => t.id !== id));
    const { error } = await db.from('tasks').update({ status: 'done', completed_at: new Date().toISOString() }).eq('id', id);
    if (error) load();
  }, [load]);

  const addTask = useCallback(async (data) => {
    const { data: rows, error } = await db.from('tasks').insert([data]).select();
    if (!error && rows) setTasks(p => [...p, rows[0]]);
    else if (error) load();
  }, [load]);

  const rescheduleTask = useCallback(async (taskId, colId) => {
    updateTask(taskId, { scheduled_date: colDate(colId) });
  }, [updateTask]);

  const markRead = useCallback(async (id) => {
    const now = new Date().toISOString();
    setReading(p => p.map(r => r.id === id ? { ...r, read_at: now } : r));
    await db.from('reading_list').update({ read_at: now }).eq('id', id);
  }, []);

  const waitingTasks  = useMemo(() => tasks.filter(t => t.status === 'waiting'), [tasks]);
  const unreadCount   = useMemo(() => reading.filter(r => !r.read_at).length, [reading]);
  const weekTaskCount = useMemo(() => tasks.filter(t => t.status !== 'waiting').length, [tasks]);

  const tabs = [
    { id: 'week',    label: 'Week',    Icon: Ic.Week,    count: weekTaskCount },
    { id: 'waiting', label: 'Waiting', Icon: Ic.Waiting, count: waitingTasks.length },
    { id: 'reading', label: 'Reading', Icon: Ic.Reading, count: unreadCount },
  ];

  function renderContent() {
    if (loading) return (
      <div className="flex flex-col items-center justify-center h-full gap-3">
        <div className="w-6 h-6 rounded-full border-2 border-sage-500 border-t-transparent spinner" />
        <p className="text-xs text-stone-400">Loading…</p>
      </div>
    );
    if (error) return (
      <div className="flex flex-col items-center justify-center h-full px-8 text-center gap-3">
        <p className="text-sm font-medium text-red-500">Connection error</p>
        <p className="text-xs text-stone-400">{error}</p>
        <button onClick={load} className="text-xs text-sage-700 border border-sage-400/40 px-4 py-1.5 rounded-full">Retry</button>
      </div>
    );
    if (tab === 'week') return (
      <WeekView tasks={tasks} cols={cols} areas={areas} onUpdate={updateTask} onDone={markDone}
        onReschedule={rescheduleTask} activeDay={activeDay} setActiveDay={setActiveDay} />
    );
    if (tab === 'waiting') return waitingTasks.length === 0 ? <Empty tab="waiting" /> : (
      <div>
        <SectionHead label="Waiting on" count={waitingTasks.length} />
        {waitingTasks.map(t => (
          <TaskCard key={t.id} task={t} areas={areas} onUpdate={updateTask} onDone={markDone} onReschedule={rescheduleTask} cols={cols} />
        ))}
      </div>
    );
    if (tab === 'reading') {
      if (!reading.length) return <Empty tab="reading" />;
      const unread = reading.filter(r => !r.read_at);
      const read   = reading.filter(r =>  r.read_at);
      return (
        <div>
          {unread.length > 0 && <><SectionHead label="Unread" count={unread.length} />{unread.map(r => <ReadingCard key={r.id} item={r} onMarkRead={markRead} />)}</>}
          {read.length > 0   && <><SectionHead label="Read"   count={read.length}   />{read.map(r =>   <ReadingCard key={r.id} item={r} onMarkRead={markRead} />)}</>}
          <div className="h-20" />
        </div>
      );
    }
  }

  const activeDayColId = cols[activeDay]?.id || 'inbox';

  return (
    <div className="flex flex-col h-screen bg-taupe-100 overflow-hidden">

      <header className="flex-shrink-0 bg-taupe-50/95 backdrop-blur-md border-b border-taupe-200 pt-safe">
        <div className="flex items-center justify-between px-4 pt-4 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 16 16" className="text-sage-600">
                <rect x="0" y="11" width="16" height="2.5" rx="1.25" fill="currentColor" opacity="0.35"/>
                <rect x="0" y="6.75" width="16" height="2.5" rx="1.25" fill="currentColor" opacity="0.65"/>
                <rect x="0" y="2.5" width="16" height="2.5" rx="1.25" fill="currentColor"/>
              </svg>
              <span className="text-sm font-bold text-stone-800 tracking-tight">Bedrock</span>
            </div>
            <p className="text-[11px] text-stone-400 mt-0.5 ml-6">{fmtHeader()}</p>
          </div>
          <div className="flex items-center gap-3">
            {weekTaskCount > 0 && (
              <div className="text-right">
                <span className="text-xl font-bold text-stone-700">{weekTaskCount}</span>
                <p className="text-[10px] text-stone-400 -mt-0.5">tasks</p>
              </div>
            )}
            {unreadCount > 0 && (
              <div className="text-right">
                <span className="text-xl font-bold text-stone-700">{unreadCount}</span>
                <p className="text-[10px] text-stone-400 -mt-0.5">unread</p>
              </div>
            )}
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-0.5 px-3 pb-3">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`tab-btn flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                ${tab === t.id ? 'bg-taupe-200 text-stone-700' : 'text-stone-400 hover:text-stone-600 hover:bg-taupe-100'}`}>
              <t.Icon />
              {t.label}
              {t.count > 0 && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${tab === t.id ? 'bg-sage-100 text-sage-700' : 'bg-taupe-200 text-stone-400'}`}>
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </header>

      <main className="flex-1 overflow-hidden" key={tab}>{renderContent()}</main>

      <nav className="sm:hidden flex-shrink-0 border-t border-taupe-200 bg-taupe-50/95 backdrop-blur-md pb-safe">
        <div className="flex">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`tab-btn flex-1 flex flex-col items-center gap-1 pt-3 pb-2 transition-colors ${tab === t.id ? 'text-sage-600' : 'text-stone-400'}`}>
              <div className="relative">
                <t.Icon />
                {t.count > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 bg-sage-600 text-white text-[8px] font-bold rounded-full min-w-[14px] h-3.5 flex items-center justify-center px-0.5">
                    {t.count > 9 ? '9+' : t.count}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium">{t.label}</span>
              {tab === t.id && <span className="w-1 h-1 rounded-full bg-sage-600" />}
            </button>
          ))}
        </div>
      </nav>

      <button onClick={() => setShowAdd(true)}
        className="fixed z-40 bottom-[76px] right-4 sm:bottom-6 sm:right-6 w-12 h-12 bg-sage-600 hover:bg-sage-700 active:bg-sage-800 text-white rounded-2xl shadow-lg shadow-sage-800/20 flex items-center justify-center transition-all active:scale-95"
        aria-label="Add task">
        <Ic.Plus />
      </button>

      {showAdd && (
        <AddTaskModal onClose={() => setShowAdd(false)} onAdd={addTask}
          defaultColId={tab === 'week' ? activeDayColId : 'inbox'} cols={cols} areas={areas} />
      )}
    </div>
  );
}
