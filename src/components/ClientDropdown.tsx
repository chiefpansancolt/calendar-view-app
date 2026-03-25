'use client';

import { useRef, useEffect } from 'react';
import { HiUsers, HiChevronDown, HiPlus } from 'react-icons/hi2';

interface Props {
  activeClient: string | null;
  clientList: string[];
  onSwitch: (name: string) => void;
  onNew?: () => void;
  onRename?: (name: string) => void;
  onDelete?: (name: string) => void;
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
}

export default function ClientDropdown({
  activeClient,
  clientList,
  onSwitch,
  onNew,
  onRename,
  onDelete,
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
    <div className="relative inline-flex items-center" ref={wrapRef}>
      <button
        type="button"
        onClick={onToggle}
        className="inline-flex items-center gap-1.5 bg-app-light border border-app-muted rounded-md px-2.5 py-1.5 text-sm font-semibold text-app-dark cursor-pointer hover:bg-app-border transition-colors whitespace-nowrap"
      >
        <HiUsers className="w-3.5 h-3.5" />
        <span>{activeClient || 'No Client'}</span>
        <HiChevronDown className="w-3 h-3 text-gray-400" />
      </button>

      {open && (
        <div className="absolute top-[calc(100%+6px)] left-0 min-w-[200px] bg-white border border-app-border rounded-lg shadow-[0_8px_24px_rgba(13,37,58,0.14)] z-[200]">
          {clientList.length === 0 ? (
            <div className="px-3 py-2 text-sm text-gray-400 italic">No clients yet.</div>
          ) : (
            clientList.map((name) => (
              <div
                key={name}
                className={`flex items-center justify-between px-3 py-2.5 text-sm text-app-dark cursor-pointer hover:bg-[#F0F8FB] gap-2 ${name === activeClient ? 'bg-app-border font-semibold' : ''}`}
              >
                <span className="flex-1" onClick={() => { onSwitch(name); onClose(); }}>
                  {name}
                </span>
                {(onRename || onDelete) && (
                  <div className="flex gap-1 flex-shrink-0">
                    {onRename && (
                      <button
                        type="button"
                        title="Rename"
                        onClick={(e) => { e.stopPropagation(); onRename(name); }}
                        className="p-0.5 rounded text-app-muted hover:bg-white hover:text-app-navy text-xs cursor-pointer"
                      >
                        ✎
                      </button>
                    )}
                    {onDelete && (
                      <button
                        type="button"
                        title="Delete"
                        onClick={(e) => { e.stopPropagation(); onDelete(name); }}
                        className="p-0.5 rounded text-app-muted hover:bg-white hover:text-red-600 text-xs cursor-pointer"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
          {onNew && (
            <>
              <div className="border-t border-app-border my-1" />
              <div
                className="flex items-center gap-2 px-3 py-2.5 text-sm text-app-blue cursor-pointer font-medium hover:bg-[#F0F8FB]"
                onClick={() => { onNew(); onClose(); }}
              >
                <HiPlus className="w-4 h-4" />
                New Client…
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
