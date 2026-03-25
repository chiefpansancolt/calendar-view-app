'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { HiPrinter, HiPencilSquare } from 'react-icons/hi2';
import type { Meeting, Category, Person } from '@/src/lib/types';
import {
  resolveActiveClient,
  getClientList,
  loadClientData,
  setActiveClient,
} from '@/src/lib/storage';
import AppHeader from '@/src/components/AppHeader';
import AttendeeFilterDropdown from '@/src/components/AttendeeFilterDropdown';
import CalendarGrid from '@/src/components/CalendarGrid';
import MeetingsList from '@/src/components/MeetingsList';
import Legend from '@/src/components/Legend';
import EmptyState from '@/src/components/EmptyState';

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
    new Set([
      ...people.map((p) => p.name),
      ...meetings.flatMap((m) => m.attendees || []),
    ])
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
          className="flex items-center gap-2 px-3 py-1.5 border border-app-border rounded-lg text-sm text-gray-600 hover:bg-app-gray transition-colors no-print cursor-pointer"
        >
          <HiPrinter className="w-4 h-4" />
          Print / PDF
        </button>

        {/* Edit Meetings */}
        <Link
          href="/editor"
          className="flex items-center gap-2 px-3 py-1.5 bg-app-blue text-white rounded-lg text-sm font-semibold hover:bg-app-navy transition-colors no-print cursor-pointer"
        >
          <HiPencilSquare className="w-4 h-4" />
          Edit Meetings
        </Link>
      </AppHeader>

      <div className="px-6 py-4 space-y-4">
        {!hasMeetings && <EmptyState />}

        {hasMeetings && (
          <>
            {/* Calendar grid */}
            <div className="bg-white border border-app-border rounded-xl overflow-hidden">
              <CalendarGrid meetings={filteredMeetings} categories={categories} />
            </div>

            {/* Legend + meetings list */}
            <div className="space-y-4" style={{ pageBreakBefore: 'always' } as React.CSSProperties}>
              <Legend categories={categories} />
              <MeetingsList
                meetings={filteredMeetings}
                categories={categories}
                title={attendeeFilter ? `Meetings — ${attendeeFilter}` : 'All Meetings'}
                filterLabel={attendeeFilter ? `Filtered by: ${attendeeFilter}` : undefined}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
