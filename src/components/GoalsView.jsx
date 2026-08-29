import { useState, useRef, useEffect } from 'react';
import { AREA_COLORS } from '../constants';
import { AddProjectModal } from './ProjectsView';

const STATUS_BADGE = {
  active:    'bg-sage-100 text-sage-700',
  'on-hold': 'bg-amber-50 text-amber-600',
  someday:   'bg-taupe-200 text-stone-400',
};

const STATUS_LABEL = {
  active:    'Active',
  'on-hold': 'On Hold',
  someday:   'Someday',
};

function fmtDate(d) {
  if (!d) return null;
  return new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

function GoalRow({ goal, projects, areas, onUpdate, onAddProject }) {
  const [addingProject, setAddingProject] = useState(false);
  const linkedProjects = projects.filter(p => p.goal_id === goal.id);

  return (
    <div className="border-b border-taupe-100 last:border-b-0">
      <div className="px-3 pt-2.5 pb-1">
        <div className="flex items-start gap-1.5">
          <p className="text-xs font-semibold text-stone-700 flex-1 leading-snug">{goal.title}</p>
          {goal.status === 'paused' && (
            <span className="text-[9px] font-medium text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full flex-shrink-0">Paused</span>
          )}
        </div>
        {goal.target_date && (
          <p className="text-[10px] text-stone-400 mt-0.5">by {fmtDate(goal.target_date)}</p>
        )}
      </div>

      {/* Linked projects */}
      {linkedProjects.map(p => (
        <div key={p.id} className="flex items-center gap-2 pl-5 pr-3 py-1.5 bg-taupe-50/60">
          <span className="w-1 h-1 rounded-full bg-stone-300 flex-shrink-0" />
          <span className="text-[11px] text-stone-600 flex-1 truncate">{p.title}</span>
          <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full flex-shrink-0 ${STATUS_BADGE[p.status] || STATUS_BADGE.someday}`}>
            {STATUS_LABEL[p.status] || p.status}
          </span>
        </div>
      ))}

      {/* Add project under goal */}
      <div className="pl-4 pr-3 pb-2">
        <button onClick={() => setAddingProject(true)}
          className="flex items-center gap-1 text-[10px] text-stone-400 hover:text-sage-600 transition-colors py-1">
          <svg viewBox="0 0 16 16" fill="currentColor" className="w-2.5 h-2.5">
            <path d="M8.75 3.75a.75.75 0 00-1.5 0v3.5h-3.5a.75.75 0 000 1.5h3.5v3.5a.75.75 0 001.5 0v-3.5h3.5a.75.75 0 000-1.5h-3.5v-3.5z"/>
          </svg>
          Add project
        </button>
      </div>

      {addingProject && (
        <AddProjectModal
          areas={areas}
          goals={[]}
          defaultAreaId={goal.area_id}
          defaultGoalId={goal.id}
          onAdd={onAddProject}
          onClose={() => setAddingProject(false)}
        />
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
    <form onSubmit={submit} className="px-3 py-2.5 border-t border-taupe-100 bg-taupe-50/80" onClick={e => e.stopPropagation()}>
      <input ref={inputRef} type="text" value={title} onChange={e => setTitle(e.target.value)}
        placeholder="Goal title…"
        className="w-full bg-white border border-taupe-200 rounded-lg px-2.5 py-1.5 text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-sage-500/60 mb-1.5" />
      <div className="flex items-center gap-1.5">
        <input type="date" value={targetDate} onChange={e => setTargetDate(e.target.value)}
          className="flex-1 min-w-0 bg-white border border-taupe-200 rounded-lg px-2 py-1.5 text-xs text-stone-600 focus:outline-none focus:border-sage-500/60" />
        <button type="submit" disabled={!title.trim() || saving}
          className="text-xs font-semibold bg-sage-600 hover:bg-sage-700 disabled:opacity-40 text-white px-3 py-1.5 rounded-lg transition-colors flex-shrink-0">
          {saving ? '…' : 'Add'}
        </button>
        <button type="button" onClick={onCancel}
          className="text-xs text-stone-400 hover:text-stone-600 px-2 py-1.5 flex-shrink-0">✕</button>
      </div>
    </form>
  );
}

function AreaCard({ area, goals, projects, areas, onAdd, onUpdate, onAddProject }) {
  const [addingGoal, setAddingGoal] = useState(false);
  const colors = AREA_COLORS[area.color_key];
  const areaGoals = goals.filter(g => g.area_id === area.id);
  const orphanProjects = projects.filter(p => p.area_id === area.id && !p.goal_id);

  return (
    <div className="bg-white border border-taupe-200 rounded-xl overflow-hidden">
      {/* Area header */}
      <div className={`flex items-center gap-2 px-3 py-2.5 border-b border-taupe-200 border-l-4 ${colors?.ring || 'border-l-transparent'}`}>
        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${colors?.dot || 'bg-stone-300'}`} />
        <span className="text-[11px] font-bold text-stone-600 uppercase tracking-wider flex-1">{area.name}</span>
        <span className="text-[10px] text-stone-400 tabular-nums">
          {areaGoals.length > 0 ? `${areaGoals.length} goal${areaGoals.length !== 1 ? 's' : ''}` : ''}
        </span>
      </div>

      {/* Goals with linked projects */}
      {areaGoals.map(goal => (
        <GoalRow key={goal.id} goal={goal} projects={projects} areas={areas}
          onUpdate={onUpdate} onAddProject={onAddProject} />
      ))}

      {/* Projects not linked to a goal */}
      {orphanProjects.length > 0 && (
        <div className="border-t border-taupe-100">
          <p className="text-[9px] font-semibold text-stone-400 uppercase tracking-widest px-3 pt-2 pb-1">Other projects</p>
          {orphanProjects.map(p => (
            <div key={p.id} className="flex items-center gap-2 px-3 py-1.5">
              <span className="w-1 h-1 rounded-full bg-stone-300 flex-shrink-0" />
              <span className="text-[11px] text-stone-600 flex-1 truncate">{p.title}</span>
              <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full flex-shrink-0 ${STATUS_BADGE[p.status] || STATUS_BADGE.someday}`}>
                {STATUS_LABEL[p.status] || p.status}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {areaGoals.length === 0 && orphanProjects.length === 0 && !addingGoal && (
        <p className="text-[11px] text-stone-300 px-3 py-3 italic">No goals yet</p>
      )}

      {/* Add goal */}
      {addingGoal ? (
        <AddGoalForm areaId={area.id} onAdd={onAdd} onCancel={() => setAddingGoal(false)} />
      ) : (
        <button onClick={() => setAddingGoal(true)}
          className="w-full flex items-center gap-1.5 px-3 py-2.5 text-[10px] text-stone-400 hover:text-sage-600 hover:bg-taupe-50 border-t border-taupe-100 transition-colors">
          <svg viewBox="0 0 16 16" fill="currentColor" className="w-2.5 h-2.5">
            <path d="M8.75 3.75a.75.75 0 00-1.5 0v3.5h-3.5a.75.75 0 000 1.5h3.5v3.5a.75.75 0 001.5 0v-3.5h3.5a.75.75 0 000-1.5h-3.5v-3.5z"/>
          </svg>
          Add goal
        </button>
      )}
    </div>
  );
}

export function GoalsView({ goals, projects, areas, onAdd, onUpdate, onAddProject }) {
  return (
    <div className="overflow-y-auto h-full pb-24 p-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {areas.map(area => (
          <AreaCard key={area.id} area={area} goals={goals} projects={projects} areas={areas}
            onAdd={onAdd} onUpdate={onUpdate} onAddProject={onAddProject} />
        ))}
      </div>
    </div>
  );
}
