import type { Category, Meeting } from "@/src/lib/types";
import { CADENCE_LABELS, CADENCE_STYLES, DAY_ABBR, DAYS } from "@/src/lib/types";
import { fmt12, normaliseDays } from "@/src/lib/utils";

interface Props {
	meetings: Meeting[];
	categories: Category[];
	filterLabel?: string;
	title?: string;
}

export default function MeetingsList({
	meetings,
	categories,
	filterLabel,
	title = "All Meetings",
}: Props) {
	const sorted = [...meetings].sort((a, b) => {
		const daysA = normaliseDays(a.dayOfWeek);
		const daysB = normaliseDays(b.dayOfWeek);
		const di = DAYS.indexOf(daysA[0]) - DAYS.indexOf(daysB[0]);
		if (di !== 0) return di;
		return (a.startTime || "").localeCompare(b.startTime || "");
	});

	return (
		<div className="border-app-border overflow-hidden rounded-xl border bg-white">
			<div className="border-app-border flex flex-wrap items-center justify-between gap-4 border-b px-5 py-3">
				<h2 className="text-sm font-bold text-gray-800">{title}</h2>
				{filterLabel && (
					<span className="text-xs font-semibold text-gray-500 italic">
						{filterLabel}
					</span>
				)}
			</div>

			{/* Header row */}
			<div
				className="text-app-muted border-app-border grid border-b-2 bg-[#F7FBFD] px-4 py-2 text-xs font-semibold tracking-[0.05em] uppercase"
				style={{ gridTemplateColumns: "160px 140px 1fr 160px 100px 1fr 1fr", gap: "12px" }}
			>
				<div>Day(s)</div>
				<div>Time</div>
				<div>Title</div>
				<div>Category</div>
				<div>Cadence</div>
				<div>Attendees</div>
				<div>Notes / Link</div>
			</div>

			{sorted.map((m) => {
				const days = normaliseDays(m.dayOfWeek);
				const cat = categories.find((c) => c.name === m.category);
				const color = m.categoryColor || (cat ? cat.color : "#888");
				const cadStyle = CADENCE_STYLES[m.cadence] || { bg: "#F3F4F6", color: "#374151" };
				const cadLabel = CADENCE_LABELS[m.cadence] || m.cadence || "—";

				return (
					<div
						key={m.id}
						className="grid items-start border-b border-[#EAF4F8] px-4 py-2.5 text-sm last:border-b-0 hover:bg-[#F7FBFD]"
						style={{
							gridTemplateColumns: "160px 140px 1fr 160px 100px 1fr 1fr",
							gap: "12px",
						}}
					>
						<div className="leading-snug text-gray-700">
							{days.map((d) => DAY_ABBR[d] || d).join(", ")}
						</div>
						<div className="whitespace-nowrap text-gray-700">
							{fmt12(m.startTime)} – {fmt12(m.endTime)}
						</div>
						<div className="leading-snug font-semibold break-words text-gray-900">
							{m.title}
						</div>
						<div className="flex items-center gap-1 text-gray-700">
							<span
								className="h-2.5 w-2.5 flex-shrink-0 rounded-full"
								style={{ background: color }}
							/>
							<span className="leading-snug">{m.category || "—"}</span>
						</div>
						<div>
							<span
								className="rounded-full px-2 py-0.5 text-xs font-bold tracking-wide uppercase"
								style={{ background: cadStyle.bg, color: cadStyle.color }}
							>
								{cadLabel}
							</span>
						</div>
						<div className="leading-snug break-words text-gray-700">
							{m.attendees && m.attendees.length ? m.attendees.join(", ") : "—"}
						</div>
						<div className="space-y-1 leading-snug break-words text-gray-700">
							{m.description && <div>{m.description}</div>}
							{m.webexLink && (
								<a
									href={m.webexLink}
									target="_blank"
									rel="noopener noreferrer"
									className="text-app-blue underline"
								>
									Join Meeting
								</a>
							)}
							{!m.description && !m.webexLink && "—"}
						</div>
					</div>
				);
			})}
		</div>
	);
}
