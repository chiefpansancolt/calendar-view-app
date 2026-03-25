import Link from 'next/link';
import { HiCalendarDays } from 'react-icons/hi2';

export default function EmptyState() {
  return (
    <div className="bg-white border border-dashed border-app-border rounded-xl p-12 text-center">
      <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 bg-app-border">
        <HiCalendarDays className="w-7 h-7 text-app-blue" />
      </div>
      <h3 className="font-bold text-gray-800 text-lg mb-1">No meetings loaded</h3>
      <p className="text-gray-500 text-sm mb-4">Add meetings in the editor to get started.</p>
      <Link
        href="/editor"
        className="inline-block px-4 py-2 rounded-lg text-sm font-semibold text-white bg-app-blue hover:bg-app-navy transition-colors"
      >
        Open Editor
      </Link>
    </div>
  );
}
