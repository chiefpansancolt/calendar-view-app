'use client';

import { useState } from 'react';
import type { Meeting, Category } from '@/src/lib/types';
import { CADENCE_LABELS, DAYS } from '@/src/lib/types';
import { fmt12, normaliseDays } from '@/src/lib/utils';

interface Props {
  meetings: Meeting[];
  categories: Category[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function MeetingsTable({ meetings, categories, onEdit, onDelete }: Props) {
  const [search, setSearch] = useState('');
  const [filterDay, setFilterDay] = useState('');
  const [filterCat, setFilterCat] = useState('');

  const inputClass =
    'border border-app-border rounded-md px-2.5 py-1.5 text-sm outline-none focus:border-app-blue transition-all bg-white';

  const filtered = meetings
    .filter((m) => {
      const days = normaliseDays(m.dayOfWeek);
      if (filterDay && !days.includes(filterDay)) return false;
      if (filterCat && m.category !== filterCat) return false;
      if (
        search &&
        !m.title.toLowerCase().includes(search.toLowerCase()) &&
        !m.category.toLowerCase().includes(search.toLowerCase()) &&
        !(m.attendees || []).join(' ').toLowerCase().includes(search.toLowerCase())
      )
        return false;
      return true;
    })
    .sort((a, b) => {
      const aFirst = DAYS.indexOf(normaliseDays(a.dayOfWeek)[0]);
      const bFirst = DAYS.indexOf(normaliseDays(b.dayOfWeek)[0]);
      if (aFirst !== bFirst) return aFirst - bFirst;
      return a.startTime.localeCompare(b.startTime);
    });

  const CADENCE_COLORS: Record<string, string> = {
    weekly: '#D6F0D2 #2A6B21',
    'bi-weekly': '#D4E7ED #0D253A',
    monthly: '#FFF0B3 #7A5A00',
    'one-time': '#EAF6FB #11395B',
  };

  return (
    <div className="bg-white border border-app-border rounded-[10px] p-5 px-6">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <h2 className="text-base font-bold text-gray-900">All Meetings</h2>
        <div className="flex gap-2 flex-wrap items-center">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search…"
            className={`${inputClass} w-[160px]`}
          />
          <select
            value={filterDay}
            onChange={(e) => setFilterDay(e.target.value)}
            className={`${inputClass} w-[130px]`}
          >
            <option value="">All Days</option>
            {DAYS.map((d) => <option key={d}>{d}</option>)}
          </select>
          <select
            value={filterCat}
            onChange={(e) => setFilterCat(e.target.value)}
            className={`${inputClass} w-[160px]`}
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.name} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-app-border">
              {['Day', 'Time', 'Title', 'Category', 'Cadence', 'Attendees', ''].map((h) => (
                <th
                  key={h}
                  className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-gray-400 italic text-sm">
                  {meetings.length === 0
                    ? 'No meetings yet. Add one using the form above.'
                    : 'No meetings match your filters.'}
                </td>
              </tr>
            ) : (
              filtered.map((m) => {
                const cat = categories.find((c) => c.name === m.category);
                const color = cat ? cat.color : '#888';
                const [cbg, cfg] = (CADENCE_COLORS[m.cadence] || '#F3F4F6 #374151').split(' ');
                const days = normaliseDays(m.dayOfWeek);

                return (
                  <tr key={m.id} className="border-b border-gray-100 hover:bg-[#F0F8FB]">
                    <td className="py-2 px-3">
                      <div className="flex flex-wrap gap-1">
                        {days.map((d) => (
                          <span
                            key={d}
                            style={{
                              background: '#EAF6FB',
                              color: '#11395B',
                              border: '1px solid #7ECBE3',
                              borderRadius: '4px',
                              padding: '1px 6px',
                              fontSize: '11px',
                              fontWeight: 700,
                            }}
                          >
                            {d.slice(0, 3).toUpperCase()}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-2 px-3 text-gray-600 whitespace-nowrap">
                      {fmt12(m.startTime)} – {fmt12(m.endTime)}
                    </td>
                    <td className="py-2 px-3 font-medium text-gray-900 max-w-[180px] truncate" title={m.title}>
                      {m.title}
                    </td>
                    <td className="py-2 px-3">
                      <span className="flex items-center gap-1.5 text-sm">
                        <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: color }} />
                        <span className="text-gray-900">{m.category}</span>
                      </span>
                    </td>
                    <td className="py-2 px-3">
                      <span
                        className="text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-[0.04em]"
                        style={{ background: cbg, color: cfg }}
                      >
                        {CADENCE_LABELS[m.cadence] || m.cadence}
                      </span>
                    </td>
                    <td
                      className="py-2 px-3 text-gray-600 text-xs max-w-[160px] truncate"
                      title={(m.attendees || []).join(', ')}
                    >
                      {(m.attendees || []).length ? m.attendees.join(', ') : <span className="text-gray-300">—</span>}
                    </td>
                    <td className="py-2 px-3 whitespace-nowrap">
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => onEdit(m.id)}
                          className="bg-white text-app-blue border border-app-muted rounded-md px-3 py-1 text-xs hover:bg-app-light transition-colors cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(m.id)}
                          className="bg-white text-red-600 border border-red-200 rounded-md px-3 py-1 text-xs hover:bg-red-50 transition-colors cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
