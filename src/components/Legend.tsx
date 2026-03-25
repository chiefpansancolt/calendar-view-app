import type { Category } from "@/src/lib/types";

interface Props {
	categories: Category[];
}

export default function Legend({ categories }: Props) {
	return (
		<div className="border-app-border rounded-xl border bg-white px-5 py-4">
			<div className="flex flex-wrap items-start gap-8">
				<div>
					<p className="mb-2 text-xs font-semibold tracking-wide text-gray-500 uppercase">
						Categories
					</p>
					<div className="flex flex-wrap gap-3">
						{categories.length === 0 ? (
							<span className="text-sm text-gray-400 italic">
								No categories defined.
							</span>
						) : (
							categories.map((c) => (
								<div
									key={c.name}
									className="text-app-dark flex items-center gap-1.5 text-sm"
								>
									<span
										className="h-3 w-3 flex-shrink-0 rounded-full"
										style={{ background: c.color }}
									/>
									<span>{c.name}</span>
								</div>
							))
						)}
					</div>
				</div>
				<div>
					<p className="mb-2 text-xs font-semibold tracking-wide text-gray-500 uppercase">
						Cadence
					</p>
					<div className="flex flex-wrap gap-3">
						<span
							className="rounded-full px-2 py-0.5 text-xs font-bold tracking-wide uppercase"
							style={{ background: "#D6F0D2", color: "#2A6B21" }}
						>
							Weekly
						</span>
						<span
							className="rounded-full px-2 py-0.5 text-xs font-bold tracking-wide uppercase"
							style={{ background: "#D4E7ED", color: "#0D253A" }}
						>
							Bi-Weekly
						</span>
						<span
							className="rounded-full px-2 py-0.5 text-xs font-bold tracking-wide uppercase"
							style={{ background: "#FFF0B3", color: "#7A5A00" }}
						>
							Monthly
						</span>
						<span
							className="rounded-full px-2 py-0.5 text-xs font-bold tracking-wide uppercase"
							style={{ background: "#EAF6FB", color: "#11395B" }}
						>
							One-Time
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}
