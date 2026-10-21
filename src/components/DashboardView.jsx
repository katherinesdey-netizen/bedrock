import { useMemo } from 'react';
import { AREA_COLORS } from '../constants';

function AreaCard({ area, goals, projects, tasks }) {
  const colors = AREA_COLORS[area.color_key];
  const areaGoals    = goals.filter(g => g.area_id === area.id);
  const areaProjects = projects.filter(p => p.area_id === area.id && p.status === 'active');
  const areaTasks    = tasks.filter(t => t.area_id === area.id && t.status !== 'waiting');

  const overdueCount = areaTasks.filter(t => {
    if (!t.due_date) return false;
    return t.due_date < new Date().toISOString().slice(0, 10);
  }).length;

  return (
    <div className={`bg-white border border-taupe-200 rounded-xl overflow-hidden border-l-4 ${colors?.ring || 'border-l-transparent'}`}>
      <div className="px-4 py-3 border-b border-taupe-100">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${colors?.dot || 'bg-stone-300'}`} />
          <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">{area.name}</span>
        </div>
      </div>

      <div className="px-4 py-3 grid grid-cols-3 divide-x divide-taupe-100">
        <div className="pr-3 text-center">
          <p className="text-xl font-bold text-stone-700">{areaTasks.length}</p>
          <p className="text-[10px] text-stone-400 mt-0.5">tasks</p>
          {overdueCount > 0 && (
            <p className="text-[9px] text-red-500 font-medium">{overdueCount} overdue</p>
          )}
        </div>
        <div className="px-3 text-center">
          <p className="text-xl font-bold text-stone-700">{areaGoals.length}</p>
          <p className="text-[10px] text-stone-400 mt-0.5">goals</p>
        </div>
        <div className="pl-3 text-center">
          <p className="text-xl font-bold text-stone-700">{areaProjects.length}</p>
          <p className="text-[10px] text-stone-400 mt-0.5">projects</p>
        </div>
      </div>

      {areaProjects.length > 0 && (
        <div className="px-4 pb-3 flex flex-col gap-1">
          {areaProjects.slice(0, 3).map(p => (
            <div key={p.id} className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-stone-300 flex-shrink-0" />
              <span className="text-[11px] text-stone-500 truncate">{p.title}</span>
            </div>
          ))}
          {areaProjects.length > 3 && (
            <p className="text-[10px] text-stone-400 ml-2.5">+{areaProjects.length - 3} more</p>
          )}
        </div>
      )}
    </div>
  );
}

export function DashboardView({ areas, goals, projects, tasks }) {
  const today = new Date().toISOString().slice(0, 10);

  const todayTasks  = useMemo(() => tasks.filter(t => t.scheduled_date === today && t.status !== 'waiting'), [tasks, today]);
  const overdue     = useMemo(() => tasks.filter(t => t.due_date && t.due_date < today && t.status !== 'waiting'), [tasks, today]);
  const waiting     = useMemo(() => tasks.filter(t => t.status === 'waiting'), [tasks]);
  const inbox       = useMemo(() => tasks.filter(t => !t.scheduled_date && t.status !== 'waiting'), [tasks]);
  const activeGoals = useMemo(() => goals.filter(g => g.status !== 'complete'), [goals]);
  const activeProj  = useMemo(() => projects.filter(p => p.status === 'active'), [projects]);

  return (
    <div className="overflow-y-auto h-full pb-24">
      {/* Summary strip */}
      <div className="flex items-stretch gap-px border-b border-taupe-200 bg-taupe-200">
        {[
          { label: 'today',    value: todayTasks.length,  highlight: todayTasks.length > 0 },
          { label: 'overdue',  value: overdue.length,     highlight: overdue.length > 0,  danger: true },
          { label: 'waiting',  value: waiting.length,     highlight: false },
          { label: 'inbox',    value: inbox.length,       highlight: inbox.length > 0 },
          { label: 'goals',    value: activeGoals.length, highlight: false },
          { label: 'projects', value: activeProj.length,  highlight: false },
        ].map(({ label, value, highlight, danger }) => (
          <div key={label} className="flex-1 flex flex-col items-center py-3 bg-taupe-50">
            <span className={`text-lg font-bold ${danger && value > 0 ? 'text-red-500' : highlight ? 'text-stone-700' : 'text-stone-400'}`}>
              {value}
            </span>
            <span className="text-[9px] font-medium text-stone-400 uppercase tracking-wide mt-0.5">{label}</span>
          </div>
        ))}
      </div>

      {/* Area cards */}
      <div className="p-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {areas.map(area => (
          <AreaCard key={area.id} area={area} goals={activeGoals} projects={projects} tasks={tasks} />
        ))}
      </div>
    </div>
  );
}
