import { useState } from 'react';
import { GoalsView } from './GoalsView';
import { ProjectsView } from './ProjectsView';

export function PlansView({ goals, projects, areas, tasks, onAddGoal, onUpdateGoal, onAddProject, onUpdateProject }) {
  const [view, setView] = useState('goals');

  const activeGoals    = goals.filter(g => g.status !== 'complete');
  const activeProjects = projects.filter(p => p.status !== 'complete');

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Sub-nav */}
      <div className="flex-shrink-0 flex items-center gap-1 px-3 py-2.5 border-b border-taupe-200 bg-taupe-50/95 backdrop-blur-md">
        {[
          { key: 'goals',    label: 'Goals',    count: activeGoals.length    },
          { key: 'projects', label: 'Projects', count: activeProjects.length },
        ].map(({ key, label, count }) => (
          <button key={key} onClick={() => setView(key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors
              ${view === key ? 'bg-taupe-200 text-stone-700' : 'text-stone-400 hover:text-stone-600 hover:bg-taupe-100'}`}>
            {label}
            {count > 0 && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold
                ${view === key ? 'bg-sage-100 text-sage-700' : 'bg-taupe-200 text-stone-400'}`}>
                {count}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-hidden">
        {view === 'goals'
          ? <GoalsView goals={activeGoals} projects={projects} areas={areas} onAdd={onAddGoal} onUpdate={onUpdateGoal} onAddProject={onAddProject} />
          : <ProjectsView projects={activeProjects} areas={areas} goals={activeGoals} tasks={tasks} onAdd={onAddProject} onUpdate={onUpdateProject} />
        }
      </div>
    </div>
  );
}
