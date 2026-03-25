"use client";

import type { Person } from "@/src/lib/types";
import { useEffect, useRef, useState } from "react";
import { HiChevronDown } from "react-icons/hi2";

interface Props {
	people: Person[];
	selected: string[];
	onChange: (names: string[]) => void;
}

export default function AttendeeMultiSelect({ people, selected, onChange }: Props) {
	const [open, setOpen] = useState(false);
	const [search, setSearch] = useState("");
	const [adhoc, setAdhoc] = useState("");
	const wrapRef = useRef<HTMLDivElement>(null);
	const searchRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		function handleClick(e: MouseEvent) {
			if (open && wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
				setOpen(false);
				setAdhoc("");
			}
		}
		document.addEventListener("click", handleClick);
		return () => document.removeEventListener("click", handleClick);
	}, [open]);

	function toggle(name: string) {
		const idx = selected.indexOf(name);
		if (idx >= 0) onChange(selected.filter((a) => a !== name));
		else onChange([...selected, name]);
	}

	function remove(name: string) {
		onChange(selected.filter((a) => a !== name));
	}

	function handleOpen(e: React.MouseEvent) {
		e.stopPropagation();
		setOpen(true);
		setSearch("");
		setTimeout(() => searchRef.current?.focus(), 50);
	}

	function handleAdhocKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
		if (e.key === "Enter") {
			e.preventDefault();
			const val = adhoc.trim();
			if (val && !selected.includes(val)) {
				onChange([...selected, val]);
			}
			setAdhoc("");
		}
	}

	const searchLower = search.toLowerCase();
	const filtered = people.filter(
		(p) =>
			!searchLower ||
			p.name.toLowerCase().includes(searchLower) ||
			(p.role || "").toLowerCase().includes(searchLower)
	);

	return (
		<div className="relative" ref={wrapRef}>
			{/* Trigger */}
			<div
				onClick={handleOpen}
				className={`relative flex min-h-[42px] cursor-pointer flex-wrap items-center gap-1.5 rounded-md border bg-white px-2.5 py-1.5 pr-9 transition-all ${
					open ? "border-app-blue shadow-[0_0_0_2px_#17A7DA22]" : "border-app-border"
				}`}
			>
				{selected.length === 0 ? (
					<span className="text-sm text-gray-400">Select attendees…</span>
				) : (
					selected.map((name) => (
						<span
							key={name}
							className="bg-app-border text-app-navy border-app-muted inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[13px]"
						>
							{name}
							<button
								type="button"
								onClick={(e) => {
									e.stopPropagation();
									remove(name);
								}}
								className="ml-0.5 cursor-pointer leading-none hover:text-red-600"
								title="Remove"
							>
								×
							</button>
						</span>
					))
				)}
				<HiChevronDown className="pointer-events-none absolute top-1/2 right-2.5 h-4 w-4 -translate-y-1/2 text-gray-400" />
			</div>

			{/* Dropdown */}
			{open && (
				<div className="border-app-border absolute top-[calc(100%+4px)] right-0 left-0 z-[100] max-h-[260px] overflow-y-auto rounded-lg border bg-white shadow-[0_8px_24px_rgba(13,37,58,0.12)]">
					{/* Search */}
					<div className="border-app-border sticky top-0 z-[1] border-b bg-white px-2.5 py-2">
						<input
							ref={searchRef}
							type="text"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							placeholder="Search roster…"
							autoComplete="off"
							className="border-app-border focus:border-app-blue w-full rounded-md border px-2.5 py-1.5 text-sm outline-none"
						/>
					</div>

					{/* Options */}
					{filtered.length === 0 ? (
						<div className="text-app-muted px-3 py-3 text-center text-sm italic">
							No people found.
						</div>
					) : (
						filtered.map((p) => {
							const checked = selected.includes(p.name);
							return (
								<div
									key={p.name}
									onClick={() => toggle(p.name)}
									className={`text-app-dark flex cursor-pointer items-center gap-2.5 px-3 py-2 text-sm hover:bg-[#F0F8FB] ${checked ? "bg-app-border" : ""}`}
								>
									<input
										type="checkbox"
										checked={checked}
										onChange={() => toggle(p.name)}
										onClick={(e) => e.stopPropagation()}
										className="accent-app-blue h-[15px] w-[15px] flex-shrink-0 cursor-pointer"
									/>
									<span className="font-medium">{p.name}</span>
									{p.role && (
										<span className="text-app-muted ml-auto text-xs">
											{p.role}
										</span>
									)}
								</div>
							);
						})
					)}

					{/* Ad-hoc footer */}
					<div className="border-app-border sticky bottom-0 border-t bg-white px-2.5 py-1.5">
						<input
							type="text"
							value={adhoc}
							onChange={(e) => setAdhoc(e.target.value)}
							onKeyDown={handleAdhocKeyDown}
							placeholder="+ Add someone not on the list (Enter)…"
							autoComplete="off"
							className="border-app-border focus:border-app-blue w-full rounded-md border px-2.5 py-1.5 text-sm outline-none"
						/>
					</div>
				</div>
			)}
		</div>
	);
}
