import type { Meeting, Category } from '@/src/lib/types';
import { CADENCE_STYLES, CADENCE_LABELS, DAY_ABBR, DAYS } from '@/src/lib/types';
import { fmt12, normaliseDays } from '@/src/lib/utils';

interface Props {
  meetings: Meeting[];
  categories: Category[];
  filterLabel?: string;
  title?: string;
}

export default function MeetingsList({ meetings, categories, filterLabel, title = 'All Meetings' }: Props) {
  const sorted = [...meetings].sort((a, b) => {
    const daysA = normaliseDays(a.dayOfWeek);
    const daysB = normaliseDays(b.dayOfWeek);
    const di = DAYS.indexOf(daysA[0]) - DAYS.indexOf(daysB[0]);
    if (di !== 0) return di;
    return (a.startTime || '').localeCompare(b.startTime || '');
  });

  return (
    <div className="bg-white border border-app-border rounded-xl overflow-hidden">
      <div className="px-5 py-3 border-b border-app-border flex items-center justify-between gap-4 flex-wrap">
        <h2 className="text-sm font-bold text-gray-800">{title}</h2>
        {filterLabel && (
          <span className="text-xs font-semibold text-gray-500 italic">{filterLabel}</span>
        )}
      </div>

      {/* Header row */}
      <div
        className="grid text-xs font-semibold text-app-muted uppercase tracking-[0.05em] bg-[#F7FBFD] border-b-2 border-app-border px-4 py-2"
        style={{ gridTemplateColumns: '160px 140px 1fr 160px 100px 1fr 1fr', gap: '12px' }}
      >
        <div>Day(s)</div>
        <div>Time</div>
        <div>Title</div>
        <div>Category</div>
        <div>Cadence</div>
        <div>Attendees</div>
        <div>Notes / Link</div>
      </div>

      {sorted.map((m) => {
        const days = normaliseDays(m.dayOfWeek);
        const cat = categories.find((c) => c.name === m.category);
        const color = m.categoryColor || (cat ? cat.color : '#888');
        const cadStyle = CADENCE_STYLES[m.cadence] || { bg: '#F3F4F6', color: '#374151' };
        const cadLabel = CADENCE_LABELS[m.cadence] || m.cadence || '—';

        return (
          <div
            key={m.id}
            className="grid items-start px-4 py-2.5 border-b border-[#EAF4F8] last:border-b-0 text-sm hover:bg-[#F7FBFD]"
            style={{ gridTemplateColumns: '160px 140px 1fr 160px 100px 1fr 1fr', gap: '12px' }}
          >
            <div className="text-gray-700 leading-snug">
              {days.map((d) => DAY_ABBR[d] || d).join(', ')}
            </div>
            <div className="text-gray-700 whitespace-nowrap">
              {fmt12(m.startTime)} – {fmt12(m.endTime)}
            </div>
            <div className="font-semibold text-gray-900 leading-snug break-words">{m.title}</div>
            <div className="flex items-center gap-1 text-gray-700">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: color }} />
              <span className="leading-snug">{m.category || '—'}</span>
            </div>
            <div>
              <span
                className="px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide"
                style={{ background: cadStyle.bg, color: cadStyle.color }}
              >
                {cadLabel}
              </span>
            </div>
            <div className="text-gray-700 leading-snug break-words">
              {m.attendees && m.attendees.length ? m.attendees.join(', ') : '—'}
            </div>
            <div className="text-gray-700 leading-snug space-y-1 break-words">
              {m.description && <div>{m.description}</div>}
              {m.webexLink && (
                <a
                  href={m.webexLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-app-blue underline"
                >
                  Join Meeting
                </a>
              )}
              {!m.description && !m.webexLink && '—'}
            </div>
          </div>
        );
      })}
    </div>
  );
}
