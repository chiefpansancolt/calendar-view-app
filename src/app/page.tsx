"use client";

import AppHeader from "@/src/components/AppHeader";
import AttendeeFilterDropdown from "@/src/components/AttendeeFilterDropdown";
import CalendarGrid from "@/src/components/CalendarGrid";
import EmptyState from "@/src/components/EmptyState";
import Legend from "@/src/components/Legend";
import MeetingsList from "@/src/components/MeetingsList";
import {
	getClientList,
	loadClientData,
	resolveActiveClient,
	setActiveClient,
} from "@/src/lib/storage";
import type { Category, Meeting, Person } from "@/src/lib/types";
import Link from "next/link";
import { useEffect, useState } from "react";
import { HiPencilSquare, HiPrinter } from "react-icons/hi2";

export default function CalendarPage() {
	const [activeClient, setActiveClientState] = useState<string | null>(null);
	const [clientList, setClientListState] = useState<string[]>([]);
	const [meetings, setMeetings] = useState<Meeting[]>([]);
	const [categories, setCategories] = useState<Category[]>([]);
	const [people, setPeople] = useState<Person[]>([]);
	const [attendeeFilter, setAttendeeFilter] = useState<string | null>(null);
	const [clientDropdownOpen, setClientDropdownOpen] = useState(false);
	const [attendeeFilterOpen, setAttendeeFilterOpen] = useState(false);

	// Load on mount
	useEffect(() => {
		const list = getClientList();
		const client = resolveActiveClient();
		setClientListState(list);
		setActiveClientState(client);
		if (client) {
			const data = loadClientData(client);
			setMeetings(data.meetings);
			setCategories(data.categories);
			setPeople(data.people);
		}
	}, []);

	function switchClient(name: string) {
		setActiveClient(name);
		setActiveClientState(name);
		setAttendeeFilter(null);
		const data = loadClientData(name);
		setMeetings(data.meetings);
		setCategories(data.categories);
		setPeople(data.people);
	}

	// Collect all attendee names for filter
	const allAttendeeNames = Array.from(
		new Set([...people.map((p) => p.name), ...meetings.flatMap((m) => m.attendees || [])])
	).sort((a, b) => a.localeCompare(b));

	const filteredMeetings = attendeeFilter
		? meetings.filter((m) => (m.attendees || []).includes(attendeeFilter))
		: meetings;

	const hasMeetings = meetings.length > 0;

	return (
		<div className="bg-app-gray min-h-screen">
			<AppHeader
				subtitle="Recurring Meeting Schedule"
				activeClient={activeClient}
				clientList={clientList}
				clientDropdownOpen={clientDropdownOpen}
				onClientToggle={() => setClientDropdownOpen((o) => !o)}
				onClientClose={() => setClientDropdownOpen(false)}
				onClientSwitch={switchClient}
			>
				{/* Attendee filter */}
				<AttendeeFilterDropdown
					people={allAttendeeNames}
					activeFilter={attendeeFilter}
					onFilter={setAttendeeFilter}
					open={attendeeFilterOpen}
					onToggle={() => setAttendeeFilterOpen((o) => !o)}
					onClose={() => setAttendeeFilterOpen(false)}
				/>

				{/* Print */}
				<button
					type="button"
					onClick={() => window.print()}
					className="border-app-border hover:bg-app-gray no-print flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-1.5 text-sm text-gray-600 transition-colors"
				>
					<HiPrinter className="h-4 w-4" />
					Print / PDF
				</button>

				{/* Edit Meetings */}
				<Link
					href="/editor"
					className="bg-app-blue hover:bg-app-navy no-print flex cursor-pointer items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-semibold text-white transition-colors"
				>
					<HiPencilSquare className="h-4 w-4" />
					Edit Meetings
				</Link>
			</AppHeader>

			<div className="space-y-4 px-6 py-4">
				{!hasMeetings && <EmptyState />}

				{hasMeetings && (
					<>
						{/* Calendar grid */}
						<div className="border-app-border overflow-hidden rounded-xl border bg-white">
							<CalendarGrid meetings={filteredMeetings} categories={categories} />
						</div>

						{/* Legend + meetings list */}
						<div
							className="space-y-4"
							style={{ pageBreakBefore: "always" } as React.CSSProperties}
						>
							<Legend categories={categories} />
							<MeetingsList
								meetings={filteredMeetings}
								categories={categories}
								title={
									attendeeFilter ? `Meetings — ${attendeeFilter}` : "All Meetings"
								}
								filterLabel={
									attendeeFilter ? `Filtered by: ${attendeeFilter}` : undefined
								}
							/>
						</div>
					</>
				)}
			</div>
		</div>
	);
}
