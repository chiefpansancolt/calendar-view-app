'use client';

import { useState } from 'react';
import type { Category } from '@/src/lib/types';
import { HiChevronDown } from 'react-icons/hi2';
import { hexToLight, RANDOM_COLORS } from '@/src/lib/utils';

interface Props {
  categories: Category[];
  onAdd: (name: string, color: string) => void;
  onDelete: (name: string) => void;
}

export default function CategoryManager({ categories, onAdd, onDelete }: Props) {
  const [name, setName] = useState('');
  const [color, setColor] = useState('#17A7DA');
  const [collapsed, setCollapsed] = useState(false);

  function handleAdd() {
    const trimmed = name.trim();
    if (!trimmed) return;
    onAdd(trimmed, color);
    setName('');
    setColor('#17A7DA');
  }

  function randomize() {
    const pool = RANDOM_COLORS.filter((c) => c !== color);
    setColor(pool[Math.floor(Math.random() * pool.length)]);
  }

  return (
    <div className="bg-white border border-app-border rounded-[10px] p-5 px-6">
      <div className="flex items-center justify-between mb-1">
        <div>
          <h2 className="text-base font-bold text-gray-900">Categories</h2>
          <p className="text-xs text-gray-500 mt-0.5">Define meeting categories and colors.</p>
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
              placeholder="Category name…"
              maxLength={60}
              className="flex-1 border border-app-border rounded-md px-2.5 py-2 text-sm outline-none focus:border-app-blue focus:shadow-[0_0_0_2px_#17A7DA22] transition-all min-w-[140px]"
            />
            <div className="flex items-center gap-2 flex-shrink-0">
              <label className="text-xs font-semibold text-app-dark">Color</label>
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-[38px] h-[34px] p-0.5 rounded border border-app-border cursor-pointer"
              />
              <button
                type="button"
                onClick={randomize}
                title="Random color"
                className="w-[34px] h-[34px] flex items-center justify-center rounded border border-app-border bg-white hover:bg-app-gray transition-colors text-base"
              >
                🎲
              </button>
            </div>
            <button
              type="button"
              onClick={handleAdd}
              className="bg-app-blue text-white rounded-md px-4 py-2 text-sm font-semibold hover:bg-app-navy transition-colors flex-shrink-0 cursor-pointer"
            >
              + Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2 min-h-[36px]">
            {categories.length === 0 ? (
              <span className="text-sm text-gray-400 italic">No categories yet.</span>
            ) : (
              categories.map((c) => (
                <div
                  key={c.name}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium"
                  style={{ background: hexToLight(c.color, 0.1), borderColor: `${c.color}44`, color: '#1a1a1a' }}
                >
                  <span className="w-3.5 h-3.5 rounded-full flex-shrink-0" style={{ background: c.color }} />
                  <span>{c.name}</span>
                  <button
                    type="button"
                    onClick={() => onDelete(c.name)}
                    className="ml-1 text-gray-400 hover:text-red-500 leading-none text-base cursor-pointer"
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
