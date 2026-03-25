"use client";

import { useEffect, useRef } from "react";
import { HiChevronDown, HiUsers } from "react-icons/hi2";

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
		document.addEventListener("click", handleClick);
		return () => document.removeEventListener("click", handleClick);
	}, [open, onClose]);

	return (
		<div className="no-print relative inline-flex items-center" ref={wrapRef}>
			<button
				type="button"
				onClick={onToggle}
				className={`inline-flex cursor-pointer items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-sm whitespace-nowrap transition-colors ${
					activeFilter
						? "bg-app-light border-app-blue text-app-navy font-semibold"
						: "border-app-border text-app-dark hover:border-app-muted bg-white hover:bg-[#F0F8FB]"
				}`}
			>
				<HiUsers className="h-4 w-4" />
				<span>{activeFilter || "All Attendees"}</span>
				<HiChevronDown className="h-3 w-3 text-gray-400" />
			</button>

			{open && (
				<div className="border-app-border absolute top-[calc(100%+6px)] left-0 z-[200] max-h-[280px] min-w-[200px] overflow-y-auto rounded-lg border bg-white shadow-[0_8px_24px_rgba(13,37,58,0.14)]">
					<div
						className={`text-app-dark cursor-pointer px-3.5 py-2 text-sm hover:bg-[#F0F8FB] ${!activeFilter ? "bg-app-border font-semibold" : ""}`}
						onClick={() => {
							onFilter(null);
							onClose();
						}}
					>
						All Attendees
					</div>
					{people.length === 0 ? (
						<div className="px-3.5 py-2 text-sm text-gray-400 italic">
							No attendees yet
						</div>
					) : (
						people.map((name) => (
							<div
								key={name}
								className={`text-app-dark cursor-pointer px-3.5 py-2 text-sm hover:bg-[#F0F8FB] ${name === activeFilter ? "bg-app-border font-semibold" : ""}`}
								onClick={() => {
									onFilter(name);
									onClose();
								}}
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
