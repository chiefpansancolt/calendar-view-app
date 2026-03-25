'use client';

import { HiXMark, HiArrowDownTray, HiArrowUpTray, HiTrash } from 'react-icons/hi2';

interface Props {
  open: boolean;
  onClose: () => void;
  onExport: () => void;
  onImport: () => void;
  onClear: () => void;
}

export default function DataModal({ open, onClose, onExport, onImport, onClear }: Props) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-[rgba(13,37,58,0.4)] z-[400] flex items-center justify-center"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-xl shadow-[0_20px_60px_rgba(13,37,58,0.22)] w-[360px] max-w-[calc(100vw-32px)] p-7">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-gray-900">Data</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-0.5 rounded text-app-muted hover:text-app-navy hover:bg-app-light transition-colors cursor-pointer"
            title="Close"
          >
            <HiXMark className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={onExport}
            className="flex items-center gap-2 justify-center bg-white text-app-dark border border-app-border rounded-md px-4 py-2 text-sm hover:bg-[#F0F8FB] transition-colors cursor-pointer"
          >
            <HiArrowDownTray className="w-4 h-4" />
            Export JSON
          </button>
          <button
            type="button"
            onClick={onImport}
            className="flex items-center gap-2 justify-center bg-white text-app-dark border border-app-border rounded-md px-4 py-2 text-sm hover:bg-[#F0F8FB] transition-colors cursor-pointer"
          >
            <HiArrowUpTray className="w-4 h-4" />
            Import JSON
          </button>
          <div className="border-t border-app-border" />
          <button
            type="button"
            onClick={onClear}
            className="flex items-center gap-2 justify-center w-full bg-white text-red-600 border border-red-200 rounded-md px-4 py-2 text-sm hover:bg-red-50 transition-colors cursor-pointer"
          >
            <HiTrash className="w-4 h-4" />
            Clear Client Data
          </button>
        </div>

        <p className="text-xs text-gray-400 mt-4">
          All data is saved in your browser's localStorage automatically.
        </p>
      </div>
    </div>
  );
}
