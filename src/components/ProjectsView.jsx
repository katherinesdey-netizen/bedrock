import { useState } from 'react';
import { AREA_COLORS, PRI } from '../constants';

const STATUS_SECTIONS = [
  { key: 'active',   label: 'Active' },
  { key: 'on-hold',  label: 'On Hold' },
  { key: 'someday',  label: 'Someday' },
];

function ProjectCard({ project, area, tasks, onUpdate }) {
  const [open, setOpen] = useState(false);
  const colors = AREA_COLORS[area?.color_key];
  const openTasks = tasks.filter(t => t.project_id === project.id && t.status !== 'waiting');
  const waitingTasks = tasks.filter(t => t.project_id === project.id && t.status === 'waiting');

  return (
    <div className={`border-b border-taupe-200/60 border-l-2 ${colors?.ring || 'border-l-transparent'}`}>
      <div className="flex items-start gap-3 px-3 py-3 cursor-pointer" onClick={() => setOpen(o => !o)}>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-1.5">
            {project.priority && (
              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5 ${PRI[project.priority]?.dot || ''}`} />
            )}
            <p className="text-sm text-stone-800 leading-snug">{project.title}</p>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 mt-1">
            {area && colors && (
              <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-md ${colors.pill}`}>{area.name}</span>
            )}
            {openTasks.length > 0 && (
              <span className="text-[10px] text-stone-400">{openTasks.length} task{openTasks.length !== 1 ? 's' : ''}</span>
            )}
            {waitingTasks.length > 0 && (
              <span className="text-[10px] text-amber-600/80">⏳ {waitingTasks.length} waiting</span>
            )}
          </div>
        </div>
        <svg viewBox="0 0 16 16" fill="currentColor" className={`w-3.5 h-3.5 text-stone-300 flex-shrink-0 mt-0.5 transition-transform ${open ? 'rotate-180' : ''}`}>
          <path d="M4.22 6.22a.75.75 0 011.06 0L8 8.94l2.72-2.72a.75.75 0 111.06 1.06l-3.25 3.25a.75.75 0 01-1.06 0L4.22 7.28a.75.75 0 010-1.06z"/>
        </svg>
      </div>

      {open && (
        <div className="px-3 pb-3 ml-3 anim-item" onClick={e => e.stopPropagation()}>
          {project.notes && (
            <p className="text-xs text-stone-500 leading-relaxed mb-3 border-l-2 border-taupe-200 pl-3 whitespace-pre-wrap">
              {project.notes}
            </p>
          )}

          {openTasks.length > 0 && (
            <div className="mb-3">
              <p className="text-[10px] font-medium text-stone-400 uppercase tracking-wide mb-1.5">Open tasks</p>
              <div className="flex flex-col gap-1">
                {openTasks.slice(0, 5).map(t => (
                  <div key={t.id} className="flex items-start gap-2 text-xs text-stone-500">
                    <span className="w-1 h-1 rounded-full bg-stone-300 flex-shrink-0 mt-1.5" />
                    <span className="leading-snug">{t.title}</span>
                  </div>
                ))}
                {openTasks.length > 5 && (
                  <p className="text-[10px] text-stone-400 ml-3">+{openTasks.length - 5} more</p>
                )}
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-1.5">
            <button onClick={() => onUpdate(project.id, { status: 'complete' })}
              className="text-xs font-medium bg-taupe-100 hover:bg-sage-100 hover:text-sage-700 text-stone-500 px-3 py-1.5 rounded-full transition-colors">
              ✓ Complete
            </button>
            {project.status !== 'on-hold' && (
              <button onClick={() => onUpdate(project.id, { status: 'on-hold' })}
                className="text-xs font-medium bg-taupe-100 hover:bg-amber-100 hover:text-amber-700 text-stone-400 px-3 py-1.5 rounded-full transition-colors">
                ⏸ On Hold
              </button>
            )}
            {project.status !== 'someday' && (
              <button onClick={() => onUpdate(project.id, { status: 'someday' })}
                className="text-xs font-medium bg-taupe-100 text-stone-400 hover:text-stone-600 px-3 py-1.5 rounded-full transition-colors">
                Someday
              </button>
            )}
            {project.status !== 'active' && (
              <button onClick={() => onUpdate(project.id, { status: 'active' })}
                className="text-xs font-medium bg-taupe-100 hover:bg-sage-100 hover:text-sage-700 text-stone-400 px-3 py-1.5 rounded-full transition-colors">
                ▶ Activate
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function AddProjectModal({ areas, goals, onAdd, onClose, defaultAreaId = '', defaultGoalId = '' }) {
  const [form, setForm] = useState({ title: '', area_id: defaultAreaId, goal_id: defaultGoalId, priority: 2, notes: '' });
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const areaGoals = goals.filter(g => g.area_id === form.area_id && g.status === 'active');

  async function submit(e) {
    e.preventDefault();
    if (!form.title.trim() || !form.area_id) return;
    setSaving(true);
    await onAdd({
      title:    form.title.trim(),
      area_id:  form.area_id,
      goal_id:  form.goal_id || null,
      priority: Number(form.priority),
      notes:    form.notes.trim() || null,
      status:   'active',
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center anim-fade bg-stone-800/30 backdrop-blur-sm"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="relative w-full sm:max-w-md bg-white border border-taupe-200 sm:rounded-2xl rounded-t-2xl shadow-xl shadow-stone-900/10 anim-modal pb-safe">
        <div className="flex justify-center pt-3 sm:hidden"><div className="w-10 h-1 bg-taupe-200 rounded-full" /></div>
        <div className="px-5 pt-4 pb-6 sm:pt-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-stone-800">New project</h2>
            <button onClick={onClose} className="text-stone-400 hover:text-stone-600 p-1">
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"/></svg>
            </button>
          </div>
          <form onSubmit={submit} className="space-y-3.5">
            <input autoFocus type="text" placeholder="Project title" value={form.title} onChange={e => set('title', e.target.value)}
              className="w-full bg-taupe-50 border border-taupe-200 rounded-xl px-4 py-3 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-sage-500/60" />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-stone-400 mb-1.5 uppercase tracking-wide">Area</label>
                <select value={form.area_id} onChange={e => { set('area_id', e.target.value); set('goal_id', ''); }}
                  className="w-full bg-taupe-50 border border-taupe-200 rounded-xl px-3 py-2.5 text-sm text-stone-700 focus:outline-none focus:border-sage-500/60 cursor-pointer">
                  <option value="">— required —</option>
                  {areas.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-medium text-stone-400 mb-1.5 uppercase tracking-wide">Priority</label>
                <select value={form.priority} onChange={e => set('priority', Number(e.target.value))}
                  className="w-full bg-taupe-50 border border-taupe-200 rounded-xl px-3 py-2.5 text-sm text-stone-700 focus:outline-none focus:border-sage-500/60 cursor-pointer">
                  <option value={1}>🔴 High</option>
                  <option value={2}>🟡 Medium</option>
                  <option value={3}>⚪ Low</option>
                </select>
              </div>
            </div>

            {areaGoals.length > 0 && (
              <div>
                <label className="block text-[11px] font-medium text-stone-400 mb-1.5 uppercase tracking-wide">Goal (optional)</label>
                <select value={form.goal_id} onChange={e => set('goal_id', e.target.value)}
                  className="w-full bg-taupe-50 border border-taupe-200 rounded-xl px-3 py-2.5 text-sm text-stone-700 focus:outline-none focus:border-sage-500/60 cursor-pointer">
                  <option value="">— none —</option>
                  {areaGoals.map(g => <option key={g.id} value={g.id}>{g.title}</option>)}
                </select>
              </div>
            )}

            <textarea placeholder="Notes (optional)" value={form.notes} onChange={e => set('notes', e.target.value)} rows={3}
              className="w-full bg-taupe-50 border border-taupe-200 rounded-xl px-4 py-3 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-sage-500/60 resize-none" />

            <button type="submit" disabled={!form.title.trim() || !form.area_id || saving}
              className="w-full bg-sage-600 hover:bg-sage-700 active:bg-sage-800 disabled:opacity-40 text-white font-semibold text-sm rounded-xl py-3 transition-colors">
              {saving ? 'Adding…' : 'Add project'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export function ProjectsView({ projects, areas, goals, tasks, onAdd, onUpdate }) {
  const [showAdd, setShowAdd] = useState(false);

  function getArea(areaId) { return areas.find(a => a.id === areaId); }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Add project button */}
      <div className="flex-shrink-0 flex justify-end px-4 py-2.5 border-b border-taupe-200 bg-taupe-50">
        <button onClick={() => setShowAdd(true)}
          className="flex items-center gap-1.5 text-xs font-medium text-sage-700 bg-sage-100 hover:bg-sage-200 px-3 py-1.5 rounded-full transition-colors">
          <svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3"><path d="M8.75 3.75a.75.75 0 00-1.5 0v3.5h-3.5a.75.75 0 000 1.5h3.5v3.5a.75.75 0 001.5 0v-3.5h3.5a.75.75 0 000-1.5h-3.5v-3.5z"/></svg>
          Add project
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pb-24">
        {STATUS_SECTIONS.map(({ key, label }) => {
          const group = projects.filter(p => p.status === key);
          if (!group.length) return null;
          return (
            <div key={key}>
              <div className="flex items-center gap-2 px-4 py-2 border-b border-taupe-200/60 bg-taupe-50/80 sticky top-0 backdrop-blur-sm z-10">
                <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-widest flex-1">{label}</span>
                <span className="text-[11px] font-semibold text-stone-500 bg-taupe-200 px-1.5 py-0.5 rounded">{group.length}</span>
              </div>
              {group.map(p => (
                <ProjectCard key={p.id} project={p} area={getArea(p.area_id)} tasks={tasks} onUpdate={onUpdate} />
              ))}
            </div>
          );
        })}

        {!projects.length && (
          <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
            <span className="text-4xl mb-4 select-none">📁</span>
            <p className="text-sm font-semibold text-stone-600 mb-1.5">No projects yet</p>
            <p className="text-xs text-stone-400 leading-relaxed max-w-xs">Projects break goals into bounded initiatives with a clear done state.</p>
          </div>
        )}
      </div>

      {showAdd && (
        <AddProjectModal areas={areas} goals={goals} onAdd={onAdd} onClose={() => setShowAdd(false)} />
      )}
    </div>
  );
}
