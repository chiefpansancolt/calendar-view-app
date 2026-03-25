import type { Category } from '@/src/lib/types';

interface Props {
  categories: Category[];
}

export default function Legend({ categories }: Props) {
  return (
    <div className="bg-white border border-app-border rounded-xl px-5 py-4">
      <div className="flex items-start gap-8 flex-wrap">
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Categories</p>
          <div className="flex flex-wrap gap-3">
            {categories.length === 0 ? (
              <span className="text-sm text-gray-400 italic">No categories defined.</span>
            ) : (
              categories.map((c) => (
                <div key={c.name} className="flex items-center gap-1.5 text-sm text-app-dark">
                  <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: c.color }} />
                  <span>{c.name}</span>
                </div>
              ))
            )}
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Cadence</p>
          <div className="flex flex-wrap gap-3">
            <span className="px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide" style={{ background: '#D6F0D2', color: '#2A6B21' }}>Weekly</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide" style={{ background: '#D4E7ED', color: '#0D253A' }}>Bi-Weekly</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide" style={{ background: '#FFF0B3', color: '#7A5A00' }}>Monthly</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide" style={{ background: '#EAF6FB', color: '#11395B' }}>One-Time</span>
          </div>
        </div>
      </div>
    </div>
  );
}
