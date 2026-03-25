import type { LayoutItem } from '@/src/lib/utils';
import { fmt12, hexToLight, darkenHex } from '@/src/lib/utils';
import { CADENCE_STYLES, CADENCE_LABELS } from '@/src/lib/types';

interface Props {
  item: LayoutItem;
}

export default function MeetingBlock({ item }: Props) {
  const { meeting: m, top, height, left, width } = item;
  const color = m.categoryColor || '#888888';
  const bgColor = hexToLight(color, 0.15);
  const textColor = darkenHex(color, 0.1);
  const cadStyle = CADENCE_STYLES[m.cadence] || { bg: '#F3F4F6', color: '#374151' };
  const cadLabel = CADENCE_LABELS[m.cadence] || m.cadence;

  const tooltip = [
    m.title,
    `${fmt12(m.startTime)} – ${fmt12(m.endTime)}`,
    `${m.category} · ${cadLabel}`,
    m.attendees && m.attendees.length ? 'Attendees: ' + m.attendees.join(', ') : '',
    m.webexLink ? m.webexLink : '',
  ].filter(Boolean).join('\n');

  return (
    <div
      title={tooltip}
      style={{
        position: 'absolute',
        top: `${top}px`,
        height: `${height}px`,
        left: `${left}%`,
        width: `${width}%`,
        background: bgColor,
        borderLeft: `3px solid ${color}`,
        color: textColor,
        borderRadius: '6px',
        overflow: 'hidden',
        boxSizing: 'border-box',
        padding: '4px 7px',
        cursor: 'default',
        boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
        zIndex: 2,
        WebkitPrintColorAdjust: 'exact',
        printColorAdjust: 'exact',
      }}
      className="hover:shadow-md hover:z-[5] transition-shadow"
    >
      <div style={{ fontSize: '11px', fontWeight: 700, lineHeight: 1.3, overflow: 'hidden', wordBreak: 'break-word' }}>
        {m.title}
      </div>
      {height > 22 && (
        <div style={{ fontSize: '10px', opacity: 0.85 }}>
          {fmt12(m.startTime)} – {fmt12(m.endTime)}
        </div>
      )}
    </div>
  );
}
