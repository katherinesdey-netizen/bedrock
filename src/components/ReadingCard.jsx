import { SRC } from '../constants';

export function ReadingCard({ item, onMarkRead }) {
  const src = item.source_account ? SRC[item.source_account] : null;
  let host = '';
  try { host = new URL(item.url).hostname.replace(/^www\./, ''); } catch (_) {}

  return (
    <div className={`task-card flex items-start gap-3 px-4 py-3.5 border-b border-taupe-200/60 ${item.read_at ? 'opacity-40' : ''}`}>
      <div className="flex-1 min-w-0">
        <a href={item.url} target="_blank" rel="noopener noreferrer"
          onClick={() => !item.read_at && onMarkRead(item.id)}
          className="block text-sm text-stone-800 hover:text-sage-700 leading-snug mb-1.5 transition-colors">
          {item.title || item.url}
        </a>
        <div className="flex items-center gap-2">
          {src && <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-md ${src.pill}`}>{src.label}</span>}
          {host && <span className="text-[10px] text-stone-400 truncate">{host}</span>}
        </div>
      </div>
      {!item.read_at && (
        <button onClick={() => onMarkRead(item.id)}
          className="flex-shrink-0 text-[10px] font-medium text-stone-400 hover:text-sage-700 bg-taupe-100 hover:bg-sage-100 px-2.5 py-1.5 rounded-full transition-colors mt-0.5">
          ✓ Read
        </button>
      )}
    </div>
  );
}
