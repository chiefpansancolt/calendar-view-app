"use client";

import { HiArrowDownTray, HiArrowUpTray, HiTrash, HiXMark } from "react-icons/hi2";

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
			className="fixed inset-0 z-[400] flex items-center justify-center bg-[rgba(13,37,58,0.4)]"
			onClick={(e) => {
				if (e.target === e.currentTarget) onClose();
			}}
		>
			<div className="w-[360px] max-w-[calc(100vw-32px)] rounded-xl bg-white p-7 shadow-[0_20px_60px_rgba(13,37,58,0.22)]">
				<div className="mb-5 flex items-center justify-between">
					<h2 className="text-base font-bold text-gray-900">Data</h2>
					<button
						type="button"
						onClick={onClose}
						className="text-app-muted hover:text-app-navy hover:bg-app-light cursor-pointer rounded p-0.5 transition-colors"
						title="Close"
					>
						<HiXMark className="h-5 w-5" />
					</button>
				</div>

				<div className="flex flex-col gap-3">
					<button
						type="button"
						onClick={onExport}
						className="text-app-dark border-app-border flex cursor-pointer items-center justify-center gap-2 rounded-md border bg-white px-4 py-2 text-sm transition-colors hover:bg-[#F0F8FB]"
					>
						<HiArrowDownTray className="h-4 w-4" />
						Export JSON
					</button>
					<button
						type="button"
						onClick={onImport}
						className="text-app-dark border-app-border flex cursor-pointer items-center justify-center gap-2 rounded-md border bg-white px-4 py-2 text-sm transition-colors hover:bg-[#F0F8FB]"
					>
						<HiArrowUpTray className="h-4 w-4" />
						Import JSON
					</button>
					<div className="border-app-border border-t" />
					<button
						type="button"
						onClick={onClear}
						className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-red-200 bg-white px-4 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
					>
						<HiTrash className="h-4 w-4" />
						Clear Client Data
					</button>
				</div>

				<p className="mt-4 text-xs text-gray-400">
					All data is saved in your browser's localStorage automatically.
				</p>
			</div>
		</div>
	);
}
