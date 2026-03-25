'use client';

import { useState, useRef, useEffect } from 'react';
import { HiChevronDown } from 'react-icons/hi2';
import type { Person } from '@/src/lib/types';

interface Props {
  people: Person[];
  selected: string[];
  onChange: (names: string[]) => void;
}

export default function AttendeeMultiSelect({ people, selected, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [adhoc, setAdhoc] = useState('');
  const wrapRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (open && wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
        setAdhoc('');
      }
    }
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [open]);

  function toggle(name: string) {
    const idx = selected.indexOf(name);
    if (idx >= 0) onChange(selected.filter((a) => a !== name));
    else onChange([...selected, name]);
  }

  function remove(name: string) {
    onChange(selected.filter((a) => a !== name));
  }

  function handleOpen(e: React.MouseEvent) {
    e.stopPropagation();
    setOpen(true);
    setSearch('');
    setTimeout(() => searchRef.current?.focus(), 50);
  }

  function handleAdhocKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault();
      const val = adhoc.trim();
      if (val && !selected.includes(val)) {
        onChange([...selected, val]);
      }
      setAdhoc('');
    }
  }

  const searchLower = search.toLowerCase();
  const filtered = people.filter(
    (p) =>
      !searchLower ||
      p.name.toLowerCase().includes(searchLower) ||
      (p.role || '').toLowerCase().includes(searchLower)
  );

  return (
    <div className="relative" ref={wrapRef}>
      {/* Trigger */}
      <div
        onClick={handleOpen}
        className={`flex flex-wrap gap-1.5 items-center border rounded-md px-2.5 py-1.5 pr-9 min-h-[42px] bg-white cursor-pointer relative transition-all ${
          open ? 'border-app-blue shadow-[0_0_0_2px_#17A7DA22]' : 'border-app-border'
        }`}
      >
        {selected.length === 0 ? (
          <span className="text-gray-400 text-sm">Select attendees…</span>
        ) : (
          selected.map((name) => (
            <span
              key={name}
              className="inline-flex items-center gap-1 bg-app-border text-app-navy border border-app-muted rounded-full px-2.5 py-0.5 text-[13px]"
            >
              {name}
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); remove(name); }}
                className="leading-none hover:text-red-600 ml-0.5 cursor-pointer"
                title="Remove"
              >
                ×
              </button>
            </span>
          ))
        )}
        <HiChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-[calc(100%+4px)] left-0 right-0 bg-white border border-app-border rounded-lg shadow-[0_8px_24px_rgba(13,37,58,0.12)] z-[100] max-h-[260px] overflow-y-auto">
          {/* Search */}
          <div className="sticky top-0 bg-white px-2.5 py-2 border-b border-app-border z-[1]">
            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search roster…"
              autoComplete="off"
              className="w-full border border-app-border rounded-md px-2.5 py-1.5 text-sm outline-none focus:border-app-blue"
            />
          </div>

          {/* Options */}
          {filtered.length === 0 ? (
            <div className="px-3 py-3 text-sm text-app-muted italic text-center">No people found.</div>
          ) : (
            filtered.map((p) => {
              const checked = selected.includes(p.name);
              return (
                <div
                  key={p.name}
                  onClick={() => toggle(p.name)}
                  className={`flex items-center gap-2.5 px-3 py-2 cursor-pointer text-sm text-app-dark hover:bg-[#F0F8FB] ${checked ? 'bg-app-border' : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggle(p.name)}
                    onClick={(e) => e.stopPropagation()}
                    className="w-[15px] h-[15px] flex-shrink-0 cursor-pointer accent-app-blue"
                  />
                  <span className="font-medium">{p.name}</span>
                  {p.role && <span className="text-app-muted text-xs ml-auto">{p.role}</span>}
                </div>
              );
            })
          )}

          {/* Ad-hoc footer */}
          <div className="sticky bottom-0 bg-white border-t border-app-border px-2.5 py-1.5">
            <input
              type="text"
              value={adhoc}
              onChange={(e) => setAdhoc(e.target.value)}
              onKeyDown={handleAdhocKeyDown}
              placeholder="+ Add someone not on the list (Enter)…"
              autoComplete="off"
              className="w-full border border-app-border rounded-md px-2.5 py-1.5 text-sm outline-none focus:border-app-blue"
            />
          </div>
        </div>
      )}
    </div>
  );
}
