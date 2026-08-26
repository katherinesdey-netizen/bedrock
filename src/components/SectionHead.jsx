export function SectionHead({ label, count }) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 border-b border-taupe-200/60 bg-taupe-50/80 sticky top-0 backdrop-blur-sm z-10">
      <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-widest">{label}</span>
      <span className="text-[11px] font-semibold text-stone-500 bg-taupe-200 px-1.5 py-0.5 rounded">{count}</span>
    </div>
  );
}

export function Empty({ tab }) {
  const m = {
    waiting: { icon: '⏳', h: 'Nothing in flight',     s: "Tasks where you're waiting on someone else." },
    reading: { icon: '📚', h: 'Reading list is empty', s: 'Save articles, links, and newsletters here.' },
  }[tab] || { icon: '📋', h: 'Empty', s: '' };
  return (
    <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
      <span className="text-4xl mb-4 select-none">{m.icon}</span>
      <p className="text-sm font-semibold text-stone-600 mb-1.5">{m.h}</p>
      <p className="text-xs text-stone-400 leading-relaxed max-w-xs">{m.s}</p>
    </div>
  );
}
