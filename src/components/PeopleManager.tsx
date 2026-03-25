"use client";

import type { Person } from "@/src/lib/types";
import { useState } from "react";
import { HiChevronDown } from "react-icons/hi2";

interface Props {
	people: Person[];
	onAdd: (name: string, role: string) => void;
	onDelete: (name: string) => void;
}

export default function PeopleManager({ people, onAdd, onDelete }: Props) {
	const [name, setName] = useState("");
	const [role, setRole] = useState("");
	const [collapsed, setCollapsed] = useState(false);

	function handleAdd() {
		const trimmed = name.trim();
		if (!trimmed) return;
		onAdd(trimmed, role.trim());
		setName("");
		setRole("");
	}

	return (
		<div className="border-app-border rounded-[10px] border bg-white p-5 px-6">
			<div className="mb-1 flex items-center justify-between">
				<div>
					<h2 className="text-base font-bold text-gray-900">People</h2>
					<p className="mt-0.5 text-xs text-gray-500">
						Attendee roster. Names appear as a multi-select in the meeting form.
					</p>
				</div>
				<button
					type="button"
					onClick={() => setCollapsed((c) => !c)}
					className="text-app-muted hover:text-app-navy hover:bg-app-light flex cursor-pointer items-center rounded p-0.5 transition-colors"
					title={collapsed ? "Expand" : "Collapse"}
				>
					<HiChevronDown
						className="h-5 w-5 transition-transform"
						style={{ transform: collapsed ? "rotate(-90deg)" : "rotate(0deg)" }}
					/>
				</button>
			</div>

			{!collapsed && (
				<div className="pt-3">
					<div className="mb-4 flex flex-wrap items-center gap-3">
						<input
							type="text"
							value={name}
							onChange={(e) => setName(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									e.preventDefault();
									handleAdd();
								}
							}}
							placeholder="Full name…"
							maxLength={80}
							className="border-app-border focus:border-app-blue min-w-[120px] flex-1 rounded-md border px-2.5 py-2 text-sm transition-all outline-none focus:shadow-[0_0_0_2px_#17A7DA22]"
						/>
						<input
							type="text"
							value={role}
							onChange={(e) => setRole(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									e.preventDefault();
									handleAdd();
								}
							}}
							placeholder="Role / title (optional)…"
							maxLength={80}
							className="border-app-border focus:border-app-blue min-w-[120px] flex-1 rounded-md border px-2.5 py-2 text-sm transition-all outline-none focus:shadow-[0_0_0_2px_#17A7DA22]"
						/>
						<button
							type="button"
							onClick={handleAdd}
							className="bg-app-blue hover:bg-app-navy flex-shrink-0 cursor-pointer rounded-md px-4 py-2 text-sm font-semibold text-white transition-colors"
						>
							+ Add
						</button>
					</div>

					<div className="flex min-h-[36px] flex-wrap gap-2">
						{people.length === 0 ? (
							<span className="text-sm text-gray-400 italic">
								No people yet. Add someone above.
							</span>
						) : (
							people.map((p) => (
								<div
									key={p.name}
									className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700"
								>
									<span className="bg-app-blue flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white">
										{p.name.charAt(0).toUpperCase()}
									</span>
									<span>{p.name}</span>
									{p.role && (
										<span className="font-normal text-gray-400">{p.role}</span>
									)}
									<button
										type="button"
										onClick={() => onDelete(p.name)}
										className="ml-1 cursor-pointer text-base leading-none text-gray-300 hover:text-red-500"
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
