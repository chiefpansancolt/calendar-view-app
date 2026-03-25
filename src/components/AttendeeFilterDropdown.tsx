'use client';

import { useRef, useEffect } from 'react';
import { HiUsers, HiChevronDown } from 'react-icons/hi2';

interface Props {
  people: string[];
  activeFilter: string | null;
  onFilter: (name: string | null) => void;
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
}

export default function AttendeeFilterDropdown({
  people,
  activeFilter,
  onFilter,
  open,
  onToggle,
  onClose,
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (open && wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [open, onClose]);

  return (
    <div className="relative inline-flex items-center no-print" ref={wrapRef}>
      <button
        type="button"
        onClick={onToggle}
        className={`inline-flex items-center gap-1.5 border rounded-md px-2.5 py-1.5 text-sm cursor-pointer transition-colors whitespace-nowrap ${
          activeFilter
            ? 'bg-app-light border-app-blue font-semibold text-app-navy'
            : 'bg-white border-app-border text-app-dark hover:bg-[#F0F8FB] hover:border-app-muted'
        }`}
      >
        <HiUsers className="w-4 h-4" />
        <span>{activeFilter || 'All Attendees'}</span>
        <HiChevronDown className="w-3 h-3 text-gray-400" />
      </button>

      {open && (
        <div className="absolute top-[calc(100%+6px)] left-0 min-w-[200px] max-h-[280px] overflow-y-auto bg-white border border-app-border rounded-lg shadow-[0_8px_24px_rgba(13,37,58,0.14)] z-[200]">
          <div
            className={`px-3.5 py-2 text-sm text-app-dark cursor-pointer hover:bg-[#F0F8FB] ${!activeFilter ? 'bg-app-border font-semibold' : ''}`}
            onClick={() => { onFilter(null); onClose(); }}
          >
            All Attendees
          </div>
          {people.length === 0 ? (
            <div className="px-3.5 py-2 text-sm text-gray-400 italic">No attendees yet</div>
          ) : (
            people.map((name) => (
              <div
                key={name}
                className={`px-3.5 py-2 text-sm text-app-dark cursor-pointer hover:bg-[#F0F8FB] ${name === activeFilter ? 'bg-app-border font-semibold' : ''}`}
                onClick={() => { onFilter(name); onClose(); }}
              >
                {name}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
