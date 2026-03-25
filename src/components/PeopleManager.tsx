'use client';

import { useState } from 'react';
import type { Person } from '@/src/lib/types';
import { HiChevronDown } from 'react-icons/hi2';

interface Props {
  people: Person[];
  onAdd: (name: string, role: string) => void;
  onDelete: (name: string) => void;
}

export default function PeopleManager({ people, onAdd, onDelete }: Props) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [collapsed, setCollapsed] = useState(false);

  function handleAdd() {
    const trimmed = name.trim();
    if (!trimmed) return;
    onAdd(trimmed, role.trim());
    setName('');
    setRole('');
  }

  return (
    <div className="bg-white border border-app-border rounded-[10px] p-5 px-6">
      <div className="flex items-center justify-between mb-1">
        <div>
          <h2 className="text-base font-bold text-gray-900">People</h2>
          <p className="text-xs text-gray-500 mt-0.5">Attendee roster. Names appear as a multi-select in the meeting form.</p>
        </div>
        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          className="flex items-center p-0.5 rounded text-app-muted hover:text-app-navy hover:bg-app-light transition-colors cursor-pointer"
          title={collapsed ? 'Expand' : 'Collapse'}
        >
          <HiChevronDown
            className="w-5 h-5 transition-transform"
            style={{ transform: collapsed ? 'rotate(-90deg)' : 'rotate(0deg)' }}
          />
        </button>
      </div>

      {!collapsed && (
        <div className="pt-3">
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAdd(); } }}
              placeholder="Full name…"
              maxLength={80}
              className="flex-1 border border-app-border rounded-md px-2.5 py-2 text-sm outline-none focus:border-app-blue focus:shadow-[0_0_0_2px_#17A7DA22] transition-all min-w-[120px]"
            />
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAdd(); } }}
              placeholder="Role / title (optional)…"
              maxLength={80}
              className="flex-1 border border-app-border rounded-md px-2.5 py-2 text-sm outline-none focus:border-app-blue focus:shadow-[0_0_0_2px_#17A7DA22] transition-all min-w-[120px]"
            />
            <button
              type="button"
              onClick={handleAdd}
              className="bg-app-blue text-white rounded-md px-4 py-2 text-sm font-semibold hover:bg-app-navy transition-colors flex-shrink-0 cursor-pointer"
            >
              + Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2 min-h-[36px]">
            {people.length === 0 ? (
              <span className="text-sm text-gray-400 italic">No people yet. Add someone above.</span>
            ) : (
              people.map((p) => (
                <div
                  key={p.name}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 bg-white text-sm font-medium text-gray-700"
                >
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 bg-app-blue"
                  >
                    {p.name.charAt(0).toUpperCase()}
                  </span>
                  <span>{p.name}</span>
                  {p.role && <span className="text-gray-400 font-normal">{p.role}</span>}
                  <button
                    type="button"
                    onClick={() => onDelete(p.name)}
                    className="ml-1 text-gray-300 hover:text-red-500 leading-none text-base cursor-pointer"
                    title="Remove"
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
