import { useState } from 'react';
import { SRC, PRI, AREA_COLORS } from '../constants';
import { fmtDue, taskColId } from '../utils';
import { Ic } from './Icons';

export function TaskCard({ task, areas = [], projects = [], onUpdate, onDone, onReschedule, cols, draggable, dragHandlers }) {
  const [open, setOpen] = useState(false);
  const due = fmtDue(task.due_date);
  const src = task.source_account ? SRC[task.source_account] : null;
  const currentCol = taskColId(task, cols);
  const area = task.area_id ? areas.find(a => a.id === task.area_id) : null;
  const areaColors = area ? AREA_COLORS[area.color_key] : null;
  const assignedProject = task.project_id ? projects.find(p => p.id === task.project_id) : null;
  const activeProjects = projects.filter(p => p.status === 'active');

  function qa(updates, e) {
    e.stopPropagation();
    onUpdate(task.id, updates);
    setOpen(false);
  }

  return (
    <div className={`task-card border-b border-taupe-200/60 border-l-2 ${areaColors ? areaColors.ring : 'border-l-transparent'}`} {...(dragHandlers || {})}>
      <div className="flex items-start gap-3 px-3 py-3 cursor-pointer" onClick={() => setOpen(o => !o)}>
        {draggable && (
          <div className="hidden sm:flex mt-1 flex-shrink-0 opacity-20 cursor-grab">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-stone-400">
              <path d="M7 2a2 2 0 110 4 2 2 0 010-4zm6 0a2 2 0 110 4 2 2 0 010-4zM7 8a2 2 0 110 4 2 2 0 010-4zm6 0a2 2 0 110 4 2 2 0 010-4zm-6 6a2 2 0 110 4 2 2 0 010-4zm6 0a2 2 0 110 4 2 2 0 010-4z"/>
            </svg>
          </div>
        )}
        <div className="check-circle mt-0.5" onClick={e => { e.stopPropagation(); onDone(task.id); }}>
          <span className="text-sage-600"><Ic.Check /></span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-1.5">
            {task.priority && <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5 ${PRI[task.priority]?.dot}`} />}
            <p className="text-sm text-stone-800 leading-snug">{task.title}</p>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 mt-1">
            {src && (
              <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-md ${src.pill}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${src.dot}`} />{src.label}
              </span>
            )}
            {area && areaColors && (
              <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-md ${areaColors.pill}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${areaColors.dot}`} />{area.name}
              </span>
            )}
            {due && <span className={`text-[10px] font-medium ${due.over ? 'text-red-500' : 'text-stone-400'}`}>{due.over ? '⚠ ' : ''}{due.str}</span>}
            {task.waiting_on && <span className="text-[10px] text-amber-600/80">⏳ {task.waiting_on}</span>}
          </div>
        </div>
        <div className="text-stone-300 flex-shrink-0 mt-0.5">{open ? <Ic.ChevU /> : <Ic.ChevD />}</div>
      </div>

      {open && (
        <div className="px-3 pb-3 ml-9 anim-item" onClick={e => e.stopPropagation()}>
          {task.notes && (
            <p className="text-xs text-stone-500 leading-relaxed mb-3 whitespace-pre-wrap border-l-2 border-taupe-200 pl-3">
              {task.notes}
            </p>
          )}

          <div className="flex flex-wrap gap-1.5 mb-2.5">
            <button onClick={e => { e.stopPropagation(); onDone(task.id); }}
              className="text-xs font-medium bg-taupe-100 hover:bg-sage-100 hover:text-sage-700 text-stone-500 px-3 py-1.5 rounded-full transition-colors">
              ✓ Done
            </button>
            {task.status !== 'waiting' && (
              <button onClick={e => qa({ status: 'waiting' }, e)}
                className="text-xs font-medium bg-taupe-100 hover:bg-amber-100 hover:text-amber-700 text-stone-400 px-3 py-1.5 rounded-full transition-colors">
                ⏳ Waiting
              </button>
            )}
            {task.status === 'waiting' && (
              <button onClick={e => qa({ status: 'active' }, e)}
                className="text-xs font-medium bg-taupe-100 hover:bg-sage-100 hover:text-sage-700 text-stone-400 px-3 py-1.5 rounded-full transition-colors">
                ↑ Active
              </button>
            )}
          </div>

          {/* Area assignment */}
          {areas.length > 0 && (
            <div className="mb-2.5">
              <span className="text-[10px] text-stone-400 font-medium uppercase tracking-wide">Area</span>
              {area ? (
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-xs px-2 py-1 rounded-full ${areaColors ? areaColors.pill : 'bg-taupe-100 text-stone-600'}`}>{area.name}</span>
                  <button onClick={e => { e.stopPropagation(); onUpdate(task.id, { area_id: null }); }}
                    className="text-[10px] text-stone-400 hover:text-red-500 transition-colors">✕</button>
                </div>
              ) : (
                <select defaultValue="" onChange={e => { if (e.target.value) onUpdate(task.id, { area_id: e.target.value }); }}
                  className="mt-1 w-full bg-taupe-100 border border-taupe-200 rounded-lg px-2.5 py-1.5 text-xs text-stone-600 focus:outline-none cursor-pointer">
                  <option value="">— assign to area —</option>
                  {areas.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              )}
            </div>
          )}

          {/* Project assignment */}
          {(assignedProject || activeProjects.length > 0) && (
            <div className="mb-2.5">
              <span className="text-[10px] text-stone-400 font-medium uppercase tracking-wide">Project</span>
              {assignedProject ? (
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-stone-600 bg-taupe-100 px-2 py-1 rounded-full">{assignedProject.title}</span>
                  <button onClick={e => { e.stopPropagation(); onUpdate(task.id, { project_id: null }); }}
                    className="text-[10px] text-stone-400 hover:text-red-500 transition-colors">✕</button>
                </div>
              ) : (
                <select defaultValue="" onChange={e => { if (e.target.value) onUpdate(task.id, { project_id: e.target.value }); }}
                  className="mt-1 w-full bg-taupe-100 border border-taupe-200 rounded-lg px-2.5 py-1.5 text-xs text-stone-600 focus:outline-none cursor-pointer">
                  <option value="">— assign to project —</option>
                  {activeProjects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                </select>
              )}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] text-stone-400 font-medium uppercase tracking-wide mr-0.5">Move to</span>
            {cols.map(col => col.id === currentCol ? null : (
              <button key={col.id}
                onClick={e => { e.stopPropagation(); onReschedule(task.id, col.id); setOpen(false); }}
                className="text-[10px] font-medium bg-taupe-100 hover:bg-sage-100 hover:text-sage-700 text-stone-400 px-2 py-1 rounded-full transition-colors">
                {col.isInbox ? '≡ Inbox' : col.label}
              </button>
            ))}
            <input type="date"
              onClick={e => e.stopPropagation()}
              onChange={e => { if (e.target.value) { onUpdate(task.id, { scheduled_date: e.target.value }); setOpen(false); } }}
              className="text-[10px] bg-taupe-100 border border-taupe-200 rounded-full px-2 py-1 text-stone-400 focus:outline-none cursor-pointer" />
          </div>
        </div>
      )}
    </div>
  );
}
