import { useState, useEffect, useRef } from 'react';
import { SRC_OPTIONS } from '../constants';
import { Ic } from './Icons';

export function AddTaskModal({ onClose, onAdd, defaultColId, cols, areas = [] }) {
  const dayCols = cols.filter(c => !c.isInbox);
  const defaultDate = defaultColId && defaultColId !== 'inbox' ? defaultColId : '';
  const [form, setForm] = useState({
    title: '', notes: '', status: 'active', priority: 2,
    due_date: '', waiting_on: '', source_account: '',
    scheduled_date: defaultDate,
    area_id: '',
  });
  const [saving, setSaving] = useState(false);
  const titleRef = useRef(null);

  useEffect(() => { setTimeout(() => titleRef.current?.focus(), 80); }, []);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  async function submit(e) {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSaving(true);
    await onAdd({
      title:          form.title.trim(),
      notes:          form.notes.trim() || null,
      status:         form.status,
      priority:       Number(form.priority),
      due_date:       form.due_date || null,
      waiting_on:     form.waiting_on.trim() || null,
      source:         'manual',
      source_account: form.source_account || null,
      scheduled_date: form.scheduled_date || null,
      area_id:        form.area_id || null,
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center anim-fade bg-stone-800/30 backdrop-blur-sm"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="relative w-full sm:max-w-md bg-white border border-taupe-200 sm:rounded-2xl rounded-t-2xl shadow-xl shadow-stone-900/10 anim-modal pb-safe">
        <div className="flex justify-center pt-3 sm:hidden">
          <div className="w-10 h-1 bg-taupe-200 rounded-full" />
        </div>
        <div className="px-5 pt-4 pb-6 sm:pt-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-stone-800">New task</h2>
            <button onClick={onClose} className="text-stone-400 hover:text-stone-600 transition-colors p-1"><Ic.X /></button>
          </div>
          <form onSubmit={submit} className="space-y-3.5">
            <input ref={titleRef} type="text" placeholder="What needs to get done?"
              value={form.title} onChange={e => set('title', e.target.value)}
              className="w-full bg-taupe-50 border border-taupe-200 rounded-xl px-4 py-3 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-sage-500/60" />
            <textarea placeholder="Notes (optional)" value={form.notes} onChange={e => set('notes', e.target.value)} rows={3}
              className="w-full bg-taupe-50 border border-taupe-200 rounded-xl px-4 py-3 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-sage-500/60 resize-none" />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-stone-400 mb-1.5 uppercase tracking-wide">Schedule for</label>
                <select value={form.scheduled_date} onChange={e => set('scheduled_date', e.target.value)}
                  className="w-full bg-taupe-50 border border-taupe-200 rounded-xl px-3 py-2.5 text-sm text-stone-700 focus:outline-none focus:border-sage-500/60 cursor-pointer">
                  <option value="">To Process</option>
                  {dayCols.map(col => (
                    <option key={col.id} value={col.id}>
                      {col.label}
                      {!col.isToday && !col.label.startsWith('Tomorrow') ? ` · ${col.date.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' })}` : ''}
                    </option>
                  ))}
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

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-stone-400 mb-1.5 uppercase tracking-wide">Due date</label>
                <input type="date" value={form.due_date} onChange={e => set('due_date', e.target.value)}
                  className="w-full bg-taupe-50 border border-taupe-200 rounded-xl px-3 py-2.5 text-sm text-stone-700 focus:outline-none focus:border-sage-500/60" />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-stone-400 mb-1.5 uppercase tracking-wide">Waiting on</label>
                <input type="text" placeholder="Person…" value={form.waiting_on} onChange={e => set('waiting_on', e.target.value)}
                  className="w-full bg-taupe-50 border border-taupe-200 rounded-xl px-3 py-2.5 text-sm text-stone-700 placeholder:text-stone-300 focus:outline-none focus:border-sage-500/60" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-stone-400 mb-1.5 uppercase tracking-wide">Area</label>
                <select value={form.area_id} onChange={e => set('area_id', e.target.value)}
                  className="w-full bg-taupe-50 border border-taupe-200 rounded-xl px-3 py-2.5 text-sm text-stone-700 focus:outline-none focus:border-sage-500/60 cursor-pointer">
                  <option value="">— none —</option>
                  {areas.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-medium text-stone-400 mb-1.5 uppercase tracking-wide">Source</label>
                <select value={form.source_account} onChange={e => set('source_account', e.target.value)}
                  className="w-full bg-taupe-50 border border-taupe-200 rounded-xl px-3 py-2.5 text-sm text-stone-700 focus:outline-none focus:border-sage-500/60 cursor-pointer">
                  {SRC_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            </div>

            <button type="submit" disabled={!form.title.trim() || saving}
              className="w-full bg-sage-600 hover:bg-sage-700 active:bg-sage-800 disabled:opacity-40 text-white font-semibold text-sm rounded-xl py-3 transition-colors">
              {saving ? 'Adding…' : 'Add task'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
