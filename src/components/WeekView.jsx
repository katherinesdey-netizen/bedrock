import { useState, useMemo, useRef, useEffect } from 'react';
import { taskColId } from '../utils';
import { TaskCard } from './TaskCard';

export function WeekView({ tasks, cols, areas, onUpdate, onDone, onReschedule, activeDay, setActiveDay }) {
  const touchStartX = useRef(null);
  const pillRowRef  = useRef(null);
  const [draggedId,   setDraggedId]   = useState(null);
  const [colDragOver, setColDragOver] = useState(null);

  const dayCols = useMemo(() => cols.filter(c => !c.isInbox), [cols]);

  const colTasks = useMemo(() => {
    const groups = Object.fromEntries(cols.map(c => [c.id, []]));
    tasks.filter(t => t.status !== 'waiting').forEach(t => {
      const col = taskColId(t, cols);
      if (groups[col]) groups[col].push(t);
      else groups['inbox'].push(t);
    });
    Object.values(groups).forEach(arr =>
      arr.sort((a, b) => (a.priority ?? 2) - (b.priority ?? 2) || (a.sort_order ?? 9999) - (b.sort_order ?? 9999))
    );
    return groups;
  }, [tasks, cols]);

  useEffect(() => {
    if (!pillRowRef.current) return;
    const pill = pillRowRef.current.children[activeDay];
    if (pill) pill.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
  }, [activeDay]);

  function onTouchStart(e) { touchStartX.current = e.touches[0].clientX; }
  function onTouchEnd(e) {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 45) {
      if (dx < 0 && activeDay < cols.length - 1) setActiveDay(d => d + 1);
      if (dx > 0 && activeDay > 0) setActiveDay(d => d - 1);
    }
    touchStartX.current = null;
  }

  function onCardDragStart(e, taskId) { setDraggedId(taskId); e.dataTransfer.effectAllowed = 'move'; }
  function onColDragOver(e, colId)    { e.preventDefault(); setColDragOver(colId); }
  function onColDrop(e, colId)        { e.preventDefault(); if (draggedId) onReschedule(draggedId, colId); setDraggedId(null); setColDragOver(null); }
  function onDragEnd()                { setDraggedId(null); setColDragOver(null); }

  function renderCards(colId) {
    const list = colTasks[colId] || [];
    if (!list.length) {
      return (
        <div className="px-4 py-8 text-center text-xs text-taupe-300">
          {colId === 'inbox' ? 'All clear ✓' : 'Nothing scheduled'}
        </div>
      );
    }
    return list.map(task => (
      <TaskCard key={task.id} task={task} areas={areas} onUpdate={onUpdate} onDone={onDone}
        onReschedule={onReschedule} cols={cols} draggable
        dragHandlers={{
          draggable: true,
          onDragStart: e => onCardDragStart(e, task.id),
          onDragEnd,
          style: draggedId === task.id ? { opacity: 0.4 } : {},
        }}
      />
    ));
  }

  function colHeader(col) {
    if (col.isToday)         return { top: 'Today',    sub: col.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) };
    if (col.label === 'Tomorrow') return { top: 'Tomorrow', sub: col.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) };
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return { top: dayNames[col.date.getDay()], sub: col.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) };
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">

      {/* Mobile day pills */}
      <div className="sm:hidden flex-shrink-0 overflow-x-auto px-2 pt-2 pb-1 pill-row">
        <div ref={pillRowRef} className="flex items-center gap-0.5 w-max">
          {cols.map((col, i) => {
            const active = activeDay === i;
            const count  = (colTasks[col.id] || []).length;
            return (
              <button key={col.id} onClick={() => setActiveDay(i)}
                className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl min-w-[40px] transition-colors
                  ${active ? (col.isToday ? 'bg-sage-600 text-white' : 'bg-taupe-200 text-stone-700') : (col.isToday ? 'text-sage-600' : 'text-stone-400')}`}>
                <span className="text-[10px] font-bold">{col.short}</span>
                {!col.isInbox && <span className="text-[10px] opacity-70">{col.dateNum}</span>}
                {col.isInbox  && <span className="text-[10px] opacity-40">—</span>}
                <span className={`w-1 h-1 rounded-full ${count > 0 ? (active ? 'bg-white/60' : 'bg-sage-500') : 'bg-transparent'}`} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile swipeable slides */}
      <div className="sm:hidden flex-1 overflow-hidden week-slider-wrap" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <div className="week-slider h-full" style={{ transform: `translateX(-${activeDay * 100}%)` }}>
          {cols.map(col => {
            const hdr = col.isInbox ? null : colHeader(col);
            return (
              <div key={col.id} className="week-slide">
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-taupe-200 sticky top-0 bg-taupe-100/95 backdrop-blur-sm">
                  <div>
                    <span className="text-sm font-semibold text-stone-700">{col.label}</span>
                    {hdr && !col.isToday && col.label !== 'Tomorrow' && (
                      <span className="text-xs text-stone-400 ml-2">{col.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    )}
                    {(col.isToday || col.label === 'Tomorrow') && (
                      <span className="text-xs text-stone-400 ml-2">{col.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    )}
                  </div>
                  <span className="text-xs text-stone-400">{(colTasks[col.id] || []).length}</span>
                </div>
                <div className="overflow-y-auto" style={{ height: 'calc(100% - 44px)' }}>
                  {renderCards(col.id)}
                  <div className="h-24" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Desktop: inbox + scrollable day kanban */}
      <div className="hidden sm:flex flex-1 overflow-hidden">

        {/* Inbox — sticky left */}
        <div
          className={`inbox-panel ${colDragOver === 'inbox' && draggedId ? 'drag-over' : ''}`}
          onDragOver={e => onColDragOver(e, 'inbox')}
          onDrop={e => onColDrop(e, 'inbox')}
          onDragLeave={() => setColDragOver(null)}>
          <div className="px-4 py-3 border-b border-taupe-200 flex items-center gap-2 flex-shrink-0">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">To Process</span>
            <span className="text-[10px] text-stone-400 bg-taupe-200 px-1.5 py-0.5 rounded font-medium">{(colTasks.inbox || []).length}</span>
          </div>
          <div className="flex-1 overflow-y-auto">
            {renderCards('inbox')}
          </div>
        </div>

        {/* Day columns — scrollable */}
        <div className="flex-1 overflow-hidden">
          <div className="kanban-wrap">
            {dayCols.map(col => {
              const hdr = colHeader(col);
              return (
                <div key={col.id}
                  className={`kanban-col ${colDragOver === col.id && draggedId ? 'drag-over-col' : ''}`}
                  onDragOver={e => onColDragOver(e, col.id)}
                  onDrop={e => onColDrop(e, col.id)}
                  onDragLeave={() => setColDragOver(null)}>
                  <div className={`px-3 py-2 border-b border-taupe-200/60 ${col.isToday ? 'bg-sage-50' : ''} ${col.isWeekend ? 'bg-taupe-50' : ''}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className={`text-xs font-bold uppercase tracking-wider ${col.isToday ? 'text-sage-600' : 'text-stone-400'}`}>{hdr.top}</span>
                        <span className={`text-[10px] ml-1.5 ${col.isToday ? 'text-sage-500' : 'text-stone-300'}`}>{hdr.sub}</span>
                      </div>
                      <span className="text-[10px] text-stone-400 bg-taupe-100 px-1.5 py-0.5 rounded">{(colTasks[col.id] || []).length}</span>
                    </div>
                  </div>
                  <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
                    {renderCards(col.id)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
