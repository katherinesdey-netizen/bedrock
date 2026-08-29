import { useState, useRef, useEffect } from 'react';
import { AREA_COLORS } from '../constants';

function GoalCard({ goal, projects, onUpdate }) {
  const [open, setOpen] = useState(false);
  const linkedProjects = projects.filter(p => p.goal_id === goal.id);

  function fmtDate(d) {
    if (!d) return null;
    return new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  return (
    <div className="border-b border-taupe-200/60">
      <div className="flex items-start gap-3 px-4 py-3 cursor-pointer" onClick={() => setOpen(o => !o)}>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-stone-800 leading-snug">{goal.title}</p>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            {goal.target_date && (
              <span className="text-[10px] text-stone-400">by {fmtDate(goal.target_date)}</span>
            )}
            {linkedProjects.length > 0 && (
              <span className="text-[10px] text-stone-400">{linkedProjects.length} project{linkedProjects.length !== 1 ? 's' : ''}</span>
            )}
            {goal.status === 'paused' && (
              <span className="text-[10px] font-medium text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-md">Paused</span>
            )}
          </div>
        </div>
        <svg viewBox="0 0 16 16" fill="currentColor" className={`w-3.5 h-3.5 text-stone-300 flex-shrink-0 mt-0.5 transition-transform ${open ? 'rotate-180' : ''}`}>
          <path d="M4.22 6.22a.75.75 0 011.06 0L8 8.94l2.72-2.72a.75.75 0 111.06 1.06l-3.25 3.25a.75.75 0 01-1.06 0L4.22 7.28a.75.75 0 010-1.06z"/>
        </svg>
      </div>

      {open && (
        <div className="px-4 pb-3 ml-0 anim-item" onClick={e => e.stopPropagation()}>
          {goal.description && (
            <p className="text-xs text-stone-500 leading-relaxed mb-3 border-l-2 border-taupe-200 pl-3 whitespace-pre-wrap">
              {goal.description}
            </p>
          )}

          {linkedProjects.length > 0 && (
            <div className="mb-3">
              <p className="text-[10px] font-medium text-stone-400 uppercase tracking-wide mb-1.5">Projects</p>
              <div className="flex flex-col gap-1">
                {linkedProjects.map(p => (
                  <div key={p.id} className="flex items-center gap-2 text-xs text-stone-500">
                    <span className="w-1 h-1 rounded-full bg-stone-300 flex-shrink-0" />
                    {p.title}
                    {p.status !== 'active' && (
                      <span className="text-[10px] text-stone-400 italic">{p.status}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-1.5">
            <button onClick={() => onUpdate(goal.id, { status: 'complete' })}
              className="text-xs font-medium bg-taupe-100 hover:bg-sage-100 hover:text-sage-700 text-stone-500 px-3 py-1.5 rounded-full transition-colors">
              ✓ Complete
            </button>
            {goal.status === 'active'
              ? <button onClick={() => onUpdate(goal.id, { status: 'paused' })}
                  className="text-xs font-medium bg-taupe-100 hover:bg-amber-100 hover:text-amber-700 text-stone-400 px-3 py-1.5 rounded-full transition-colors">
                  ⏸ Pause
                </button>
              : <button onClick={() => onUpdate(goal.id, { status: 'active' })}
                  className="text-xs font-medium bg-taupe-100 hover:bg-sage-100 hover:text-sage-700 text-stone-400 px-3 py-1.5 rounded-full transition-colors">
                  ▶ Resume
                </button>
            }
          </div>
        </div>
      )}
    </div>
  );
}

function AddGoalForm({ areaId, onAdd, onCancel }) {
  const [title, setTitle] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [saving, setSaving] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  async function submit(e) {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    await onAdd({ area_id: areaId, title: title.trim(), target_date: targetDate || null, status: 'active' });
    onCancel();
  }

  return (
    <form onSubmit={submit} className="px-4 py-3 bg-taupe-50/60 border-b border-taupe-200/60" onClick={e => e.stopPropagation()}>
      <input ref={inputRef} type="text" value={title} onChange={e => setTitle(e.target.value)}
        placeholder="Goal title…"
        className="w-full bg-white border border-taupe-200 rounded-lg px-3 py-2 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-sage-500/60 mb-2" />
      <div className="flex items-center gap-2">
        <input type="date" value={targetDate} onChange={e => setTargetDate(e.target.value)}
          className="bg-white border border-taupe-200 rounded-lg px-2.5 py-1.5 text-xs text-stone-600 focus:outline-none focus:border-sage-500/60" />
        <button type="submit" disabled={!title.trim() || saving}
          className="text-xs font-medium bg-sage-600 hover:bg-sage-700 disabled:opacity-40 text-white px-3 py-1.5 rounded-full transition-colors">
          {saving ? 'Adding…' : 'Add goal'}
        </button>
        <button type="button" onClick={onCancel}
          className="text-xs text-stone-400 hover:text-stone-600 px-2 py-1.5 transition-colors">
          Cancel
        </button>
      </div>
    </form>
  );
}

export function GoalsView({ goals, projects, areas, onAdd, onUpdate }) {
  const [addingToArea, setAddingToArea] = useState(null);

  return (
    <div className="overflow-y-auto h-full pb-24">
      {areas.map(area => {
        const areaGoals = goals.filter(g => g.area_id === area.id);
        const colors = AREA_COLORS[area.color_key];
        return (
          <div key={area.id}>
            {/* Area header */}
            <div className="flex items-center gap-2 px-4 py-2 border-b border-taupe-200/60 bg-taupe-50/80 sticky top-0 backdrop-blur-sm z-10">
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${colors?.dot || 'bg-stone-300'}`} />
              <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-widest flex-1">{area.name}</span>
              {areaGoals.length > 0 && (
                <span className="text-[11px] font-semibold text-stone-500 bg-taupe-200 px-1.5 py-0.5 rounded">{areaGoals.length}</span>
              )}
            </div>

            {/* Goals */}
            {areaGoals.map(goal => (
              <GoalCard key={goal.id} goal={goal} projects={projects} onUpdate={onUpdate} />
            ))}

            {/* Add goal */}
            {addingToArea === area.id
              ? <AddGoalForm areaId={area.id} onAdd={onAdd} onCancel={() => setAddingToArea(null)} />
              : (
                <button onClick={() => setAddingToArea(area.id)}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-stone-400 hover:text-sage-700 hover:bg-sage-50/50 border-b border-taupe-200/60 transition-colors text-left">
                  <svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3"><path d="M8.75 3.75a.75.75 0 00-1.5 0v3.5h-3.5a.75.75 0 000 1.5h3.5v3.5a.75.75 0 001.5 0v-3.5h3.5a.75.75 0 000-1.5h-3.5v-3.5z"/></svg>
                  Add goal
                </button>
              )
            }
          </div>
        );
      })}
    </div>
  );
}
