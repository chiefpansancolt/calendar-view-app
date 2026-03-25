"use client";

import type { Category } from "@/src/lib/types";
import { hexToLight, RANDOM_COLORS } from "@/src/lib/utils";
import { useState } from "react";
import { HiChevronDown } from "react-icons/hi2";

interface Props {
	categories: Category[];
	onAdd: (name: string, color: string) => void;
	onDelete: (name: string) => void;
}

export default function CategoryManager({ categories, onAdd, onDelete }: Props) {
	const [name, setName] = useState("");
	const [color, setColor] = useState("#17A7DA");
	const [collapsed, setCollapsed] = useState(false);

	function handleAdd() {
		const trimmed = name.trim();
		if (!trimmed) return;
		onAdd(trimmed, color);
		setName("");
		setColor("#17A7DA");
	}

	function randomize() {
		const pool = RANDOM_COLORS.filter((c) => c !== color);
		setColor(pool[Math.floor(Math.random() * pool.length)]);
	}

	return (
		<div className="border-app-border rounded-[10px] border bg-white p-5 px-6">
			<div className="mb-1 flex items-center justify-between">
				<div>
					<h2 className="text-base font-bold text-gray-900">Categories</h2>
					<p className="mt-0.5 text-xs text-gray-500">
						Define meeting categories and colors.
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
							placeholder="Category name…"
							maxLength={60}
							className="border-app-border focus:border-app-blue min-w-[140px] flex-1 rounded-md border px-2.5 py-2 text-sm transition-all outline-none focus:shadow-[0_0_0_2px_#17A7DA22]"
						/>
						<div className="flex flex-shrink-0 items-center gap-2">
							<label className="text-app-dark text-xs font-semibold">Color</label>
							<input
								type="color"
								value={color}
								onChange={(e) => setColor(e.target.value)}
								className="border-app-border h-[34px] w-[38px] cursor-pointer rounded border p-0.5"
							/>
							<button
								type="button"
								onClick={randomize}
								title="Random color"
								className="border-app-border hover:bg-app-gray flex h-[34px] w-[34px] items-center justify-center rounded border bg-white text-base transition-colors"
							>
								🎲
							</button>
						</div>
						<button
							type="button"
							onClick={handleAdd}
							className="bg-app-blue hover:bg-app-navy flex-shrink-0 cursor-pointer rounded-md px-4 py-2 text-sm font-semibold text-white transition-colors"
						>
							+ Add
						</button>
					</div>

					<div className="flex min-h-[36px] flex-wrap gap-2">
						{categories.length === 0 ? (
							<span className="text-sm text-gray-400 italic">No categories yet.</span>
						) : (
							categories.map((c) => (
								<div
									key={c.name}
									className="flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium"
									style={{
										background: hexToLight(c.color, 0.1),
										borderColor: `${c.color}44`,
										color: "#1a1a1a",
									}}
								>
									<span
										className="h-3.5 w-3.5 flex-shrink-0 rounded-full"
										style={{ background: c.color }}
									/>
									<span>{c.name}</span>
									<button
										type="button"
										onClick={() => onDelete(c.name)}
										className="ml-1 cursor-pointer text-base leading-none text-gray-400 hover:text-red-500"
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
