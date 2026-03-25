'use client';

import type { Meeting, Category } from '@/src/lib/types';
import { DAYS } from '@/src/lib/types';
import { DAY_START, DAY_END, PX_PER_HOUR, computeLayout } from '@/src/lib/utils';
import MeetingBlock from './MeetingBlock';

interface Props {
  meetings: Meeting[];
  categories: Category[];
}

function getFilteredMeetingsForDay(meetings: Meeting[], day: string): Meeting[] {
  return meetings.filter((m) =>
    (Array.isArray(m.dayOfWeek) ? m.dayOfWeek : [m.dayOfWeek]).includes(day)
  );
}

export default function CalendarGrid({ meetings }: Props) {
  const totalHours = DAY_END - DAY_START;
  const totalHeight = totalHours * PX_PER_HOUR;

  const hours: number[] = [];
  for (let h = DAY_START; h < DAY_END; h++) hours.push(h);

  function fmtHour(h: number): string {
    if (h === 0) return '12 AM';
    if (h < 12) return `${h}:00 AM`;
    if (h === 12) return '12:00 PM';
    return `${h - 12}:00 PM`;
  }

  return (
    <div
      className="overflow-x-auto"
      style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' } as React.CSSProperties}
    >
      <div
        style={{
          minWidth: '100%',
          display: 'grid',
          gridTemplateColumns: `64px repeat(${DAYS.length}, 1fr)`,
          gridTemplateRows: `auto repeat(${totalHours}, ${PX_PER_HOUR}px)`,
        }}
      >
        {/* Top-left gutter header */}
        <div
          style={{
            gridColumn: 1,
            gridRow: 1,
            background: '#fff',
            borderBottom: '2px solid #D4E7ED',
            borderRight: '1px solid #D4E7ED',
            position: 'sticky',
            top: 0,
            zIndex: 11,
          }}
        />

        {/* Day headers */}
        {DAYS.map((day, di) => {
          const cnt = getFilteredMeetingsForDay(meetings, day).length;
          return (
            <div
              key={day}
              style={{
                gridColumn: di + 2,
                gridRow: 1,
                background: '#fff',
                borderBottom: '2px solid #D4E7ED',
                borderRight: '1px solid #E4F0F5',
                padding: '10px 8px',
                textAlign: 'center',
                position: 'sticky',
                top: 0,
                zIndex: 10,
              }}
            >
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#0D253A', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {day}
              </div>
              {cnt > 0 && (
                <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '2px' }}>
                  {cnt} meeting{cnt !== 1 ? 's' : ''}
                </div>
              )}
            </div>
          );
        })}

        {/* Time gutter cells */}
        {hours.map((h, i) => (
          <div
            key={h}
            style={{
              gridColumn: 1,
              gridRow: i + 2,
              borderRight: '1px solid #D4E7ED',
              borderBottom: '1px solid #EAF4F8',
              paddingRight: '8px',
              textAlign: 'right',
              fontSize: '11px',
              color: '#7BB3C5',
              height: `${PX_PER_HOUR}px`,
              display: 'flex',
              alignItems: 'flex-start',
              paddingTop: '4px',
              justifyContent: 'flex-end',
              boxSizing: 'border-box',
            }}
          >
            {fmtHour(h)}
          </div>
        ))}

        {/* Day columns */}
        {DAYS.map((day, di) => {
          const dayMeetings = getFilteredMeetingsForDay(meetings, day);
          const layout = computeLayout(dayMeetings);

          return (
            <div
              key={day}
              style={{
                gridColumn: di + 2,
                gridRow: `2 / ${2 + totalHours}`,
                height: `${totalHeight}px`,
                position: 'relative',
                borderRight: '1px solid #E4F0F5',
              }}
            >
              {/* Hour lines */}
              {hours.map((_, i) => (
                <div key={i}>
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      right: 0,
                      top: `${i * PX_PER_HOUR}px`,
                      borderTop: '1px solid #EAF4F8',
                      pointerEvents: 'none',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      right: 0,
                      top: `${i * PX_PER_HOUR + PX_PER_HOUR / 2}px`,
                      borderTop: '1px dashed #F2F9FC',
                      pointerEvents: 'none',
                    }}
                  />
                </div>
              ))}

              {/* Meeting blocks */}
              {layout.map((item, idx) => (
                <MeetingBlock key={item.meeting.id + idx} item={item} />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
