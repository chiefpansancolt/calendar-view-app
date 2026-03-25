"use client";

import { useEffect, useRef } from "react";
import { HiChevronDown, HiPlus, HiUsers } from "react-icons/hi2";

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
		document.addEventListener("click", handleClick);
		return () => document.removeEventListener("click", handleClick);
	}, [open, onClose]);

	return (
		<div className="relative inline-flex items-center" ref={wrapRef}>
			<button
				type="button"
				onClick={onToggle}
				className="bg-app-light border-app-muted text-app-dark hover:bg-app-border inline-flex cursor-pointer items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-sm font-semibold whitespace-nowrap transition-colors"
			>
				<HiUsers className="h-3.5 w-3.5" />
				<span>{activeClient || "No Client"}</span>
				<HiChevronDown className="h-3 w-3 text-gray-400" />
			</button>

			{open && (
				<div className="border-app-border absolute top-[calc(100%+6px)] left-0 z-[200] min-w-[200px] rounded-lg border bg-white shadow-[0_8px_24px_rgba(13,37,58,0.14)]">
					{clientList.length === 0 ? (
						<div className="px-3 py-2 text-sm text-gray-400 italic">
							No clients yet.
						</div>
					) : (
						clientList.map((name) => (
							<div
								key={name}
								className={`text-app-dark flex cursor-pointer items-center justify-between gap-2 px-3 py-2.5 text-sm hover:bg-[#F0F8FB] ${name === activeClient ? "bg-app-border font-semibold" : ""}`}
							>
								<span
									className="flex-1"
									onClick={() => {
										onSwitch(name);
										onClose();
									}}
								>
									{name}
								</span>
								{(onRename || onDelete) && (
									<div className="flex flex-shrink-0 gap-1">
										{onRename && (
											<button
												type="button"
												title="Rename"
												onClick={(e) => {
													e.stopPropagation();
													onRename(name);
												}}
												className="text-app-muted hover:text-app-navy cursor-pointer rounded p-0.5 text-xs hover:bg-white"
											>
												✎
											</button>
										)}
										{onDelete && (
											<button
												type="button"
												title="Delete"
												onClick={(e) => {
													e.stopPropagation();
													onDelete(name);
												}}
												className="text-app-muted cursor-pointer rounded p-0.5 text-xs hover:bg-white hover:text-red-600"
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
							<div className="border-app-border my-1 border-t" />
							<div
								className="text-app-blue flex cursor-pointer items-center gap-2 px-3 py-2.5 text-sm font-medium hover:bg-[#F0F8FB]"
								onClick={() => {
									onNew();
									onClose();
								}}
							>
								<HiPlus className="h-4 w-4" />
								New Client…
							</div>
						</>
					)}
				</div>
			)}
		</div>
	);
}
