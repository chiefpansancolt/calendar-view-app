import Link from "next/link";
import { HiCalendarDays } from "react-icons/hi2";

export default function EmptyState() {
	return (
		<div className="border-app-border rounded-xl border border-dashed bg-white p-12 text-center">
			<div className="bg-app-border mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full">
				<HiCalendarDays className="text-app-blue h-7 w-7" />
			</div>
			<h3 className="mb-1 text-lg font-bold text-gray-800">No meetings loaded</h3>
			<p className="mb-4 text-sm text-gray-500">Add meetings in the editor to get started.</p>
			<Link
				href="/editor"
				className="bg-app-blue hover:bg-app-navy inline-block rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors"
			>
				Open Editor
			</Link>
		</div>
	);
}
