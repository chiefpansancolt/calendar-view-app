'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { HiArrowDownTray, HiCalendarDays } from 'react-icons/hi2';
import type { Meeting, Category, Person } from '@/src/lib/types';
import {
  resolveActiveClient,
  getClientList,
  loadClientData,
  saveClientData,
  setActiveClient,
  createClient,
  renameClient,
  deleteClient,
  saveClientList,
  exportJSON,
} from '@/src/lib/storage';
import AppHeader from '@/src/components/AppHeader';
import CategoryManager from '@/src/components/CategoryManager';
import PeopleManager from '@/src/components/PeopleManager';
import MeetingForm from '@/src/components/MeetingForm';
import MeetingsTable from '@/src/components/MeetingsTable';
import DataModal from '@/src/components/DataModal';
import AlertModal from '@/src/components/AlertModal';
import ConfirmModal from '@/src/components/ConfirmModal';
import PromptModal from '@/src/components/PromptModal';

type DialogState =
  | { type: 'none' }
  | { type: 'alert'; title?: string; message: string }
  | { type: 'confirm'; title?: string; message: string; danger?: boolean; confirmLabel?: string; cancelLabel?: string; onConfirm: () => void; onCancel?: () => void }
  | { type: 'prompt'; title?: string; message?: string; defaultValue?: string; onConfirm: (value: string) => void };

export default function EditorPage() {
  const [activeClient, setActiveClientState] = useState<string | null>(null);
  const [clientList, setClientListState] = useState<string[]>([]);
  const [data, setData] = useState<{ meetings: Meeting[]; categories: Category[]; people: Person[] }>({
    meetings: [],
    categories: [],
    people: [],
  });
  const { meetings, categories, people } = data;
  const [editingMeeting, setEditingMeeting] = useState<Meeting | null>(null);
  const [clientDropdownOpen, setClientDropdownOpen] = useState(false);
  const [dataModalOpen, setDataModalOpen] = useState(false);
  const [dialog, setDialog] = useState<DialogState>({ type: 'none' });
  const importInputRef = useRef<HTMLInputElement>(null);

  function showAlert(message: string, title?: string) {
    setDialog({ type: 'alert', message, title });
  }

  function showConfirm(message: string, onConfirm: () => void, opts?: { title?: string; danger?: boolean; confirmLabel?: string }) {
    setDialog({ type: 'confirm', message, onConfirm, ...opts });
  }

  function showPrompt(onConfirm: (value: string) => void, opts?: { title?: string; message?: string; defaultValue?: string }) {
    setDialog({ type: 'prompt', onConfirm, ...opts });
  }

  function closeDialog() {
    setDialog({ type: 'none' });
  }

  // Load on mount
  useEffect(() => {
    const list = getClientList();
    const client = resolveActiveClient();
    setClientListState(list);
    setActiveClientState(client);
    if (client) {
      setData(loadClientData(client));
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setDataModalOpen(false);
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  function save(next: { meetings: Meeting[]; categories: Category[]; people: Person[] }) {
    if (!activeClient) return;
    saveClientData(activeClient, next);
  }

  function switchClient(name: string) {
    setActiveClient(name);
    setActiveClientState(name);
    setEditingMeeting(null);
    setData(loadClientData(name));
    setClientListState(getClientList());
  }

  function handleNewClient() {
    showPrompt(
      (name) => {
        const list = getClientList();
        if (list.includes(name)) {
          showAlert(`Client "${name}" already exists.`);
          return;
        }
        createClient(name);
        setClientListState(getClientList());
        switchClient(name);
      },
      { title: 'New Client', message: 'Enter a name for the new client:' }
    );
  }

  function handleRenameClient(oldName: string) {
    showPrompt(
      (newName) => {
        if (newName === oldName) return;
        const list = getClientList();
        if (list.includes(newName)) {
          showAlert(`Client "${newName}" already exists.`);
          return;
        }
        renameClient(oldName, newName);
        setClientListState(getClientList());
        if (activeClient === oldName) setActiveClientState(newName);
      },
      { title: 'Rename Client', message: 'Enter a new name:', defaultValue: oldName }
    );
  }

  function handleDeleteClient(name: string) {
    showConfirm(
      `Delete client "${name}" and all their data? This cannot be undone.`,
      () => {
        deleteClient(name);
        const list = getClientList();
        setClientListState(list);
        if (activeClient === name) {
          const next = list[0] || null;
          setActiveClientState(next);
          if (next) {
            setActiveClient(next);
            setData(loadClientData(next));
          } else {
            setData({ meetings: [], categories: [], people: [] });
          }
        }
      },
      { title: 'Delete Client', danger: true, confirmLabel: 'Delete' }
    );
  }

  // Categories
  function handleAddCategory(name: string, color: string) {
    if (categories.find((c) => c.name.toLowerCase() === name.toLowerCase())) {
      showAlert('A category with that name already exists.');
      return;
    }
    const next = { ...data, categories: [...categories, { name, color }] };
    setData(next);
    save(next);
  }

  function handleDeleteCategory(name: string) {
    const count = meetings.filter((m) => m.category === name).length;
    const doDelete = () => {
      const next = { ...data, categories: categories.filter((c) => c.name !== name) };
      setData(next);
      save(next);
    };
    if (count > 0) {
      showConfirm(
        `"${name}" is used by ${count} meeting(s). Remove anyway?`,
        doDelete,
        { title: 'Remove Category', danger: true, confirmLabel: 'Remove' }
      );
    } else {
      doDelete();
    }
  }

  // People
  function handleAddPerson(name: string, role: string) {
    if (people.find((p) => p.name.toLowerCase() === name.toLowerCase())) {
      showAlert('A person with that name already exists.');
      return;
    }
    const next = { ...data, people: [...people, { name, role }] };
    setData(next);
    save(next);
  }

  function handleDeletePerson(name: string) {
    const next = { ...data, people: people.filter((p) => p.name !== name) };
    setData(next);
    save(next);
  }

  // Meetings
  function handleSaveMeeting(meeting: Meeting) {
    const nextMeetings = editingMeeting
      ? meetings.map((m) => (m.id === meeting.id ? meeting : m))
      : [...meetings, meeting];
    const next = { ...data, meetings: nextMeetings };
    setData(next);
    setEditingMeeting(null);
    save(next);
  }

  function handleEditMeeting(id: string) {
    const m = meetings.find((m) => m.id === id);
    if (m) setEditingMeeting(m);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleDeleteMeeting(id: string) {
    const target = meetings.find((m) => m.id === id);
    if (!target) return;
    showConfirm(
      `Delete "${target.title}"?`,
      () => {
        const next = { ...data, meetings: meetings.filter((m) => m.id !== id) };
        setData(next);
        if (editingMeeting?.id === id) setEditingMeeting(null);
        save(next);
      },
      { title: 'Delete Meeting', danger: true, confirmLabel: 'Delete' }
    );
  }

  // Data modal actions
  function handleExport() {
    if (!activeClient) {
      showAlert('Select or create a client first.');
      return;
    }
    exportJSON(activeClient, meetings, categories, people);
    setDataModalOpen(false);
  }

  function handleImportClick() {
    setDataModalOpen(false);
    importInputRef.current?.click();
  }

  // Pending import data waiting for client name confirmation
  const pendingImport = useRef<{
    parsedData: { meetings: Meeting[]; categories?: Category[]; people?: Person[] };
    suggestedName: string;
  } | null>(null);

  function handleImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target?.result as string) as {
          client?: string;
          meetings?: Meeting[];
          categories?: Category[];
          people?: Person[];
        };
        if (!Array.isArray(parsed.meetings)) throw new Error('Missing meetings array');

        const suggestedName = parsed.client || file.name.replace(/\.json$/i, '');
        pendingImport.current = { parsedData: parsed as { meetings: Meeting[]; categories?: Category[]; people?: Person[] }, suggestedName };

        showPrompt(
          (targetClient) => {
            const pd = pendingImport.current;
            if (!pd) return;
            pendingImport.current = null;

            let list = getClientList();
            if (!list.includes(targetClient)) {
              list = [...list, targetClient];
              saveClientList(list);
            }

            const existing = loadClientData(targetClient);
            if (existing.meetings.length === 0) {
              // No existing data — import directly
              saveClientData(targetClient, {
                meetings: pd.parsedData.meetings,
                categories: pd.parsedData.categories || [],
                people: pd.parsedData.people || [],
              });
              setClientListState(list);
              switchClient(targetClient);
            } else {
              // Existing data — ask replace or merge
              const doMerge = () => {
                const existingIds = new Set(existing.meetings.map((m) => m.id));
                const existingCatNames = new Set(existing.categories.map((c) => c.name));
                const existingPeopleNames = new Set(existing.people.map((p) => p.name));
                saveClientData(targetClient, {
                  meetings: [...existing.meetings, ...pd.parsedData.meetings.filter((m) => !existingIds.has(m.id))],
                  categories: [...existing.categories, ...(pd.parsedData.categories || []).filter((c) => !existingCatNames.has(c.name))],
                  people: [...existing.people, ...(pd.parsedData.people || []).filter((p) => !existingPeopleNames.has(p.name))],
                });
                setClientListState(list);
                switchClient(targetClient);
                closeDialog();
              };
              setDialog({
                type: 'confirm',
                title: 'Replace or Merge?',
                message: `Client "${targetClient}" already has ${existing.meetings.length} meeting(s). Replace all data, or merge new records in?`,
                confirmLabel: 'Replace',
                danger: true,
                onConfirm: () => {
                  saveClientData(targetClient, {
                    meetings: pd.parsedData.meetings,
                    categories: pd.parsedData.categories || [],
                    people: pd.parsedData.people || [],
                  });
                  setClientListState(list);
                  switchClient(targetClient);
                  closeDialog();
                },
                onCancel: doMerge,
              });
            }
          },
          {
            title: 'Import JSON',
            message: `Found ${parsed.meetings.length} meeting(s). Enter a client name to load into:`,
            defaultValue: activeClient || suggestedName,
          }
        );
      } catch (err) {
        showAlert('Invalid JSON file: ' + (err as Error).message, 'Import Error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  function handleClearData() {
    if (!activeClient) {
      showAlert('No client selected.');
      return;
    }
    setDataModalOpen(false);
    showConfirm(
      `Clear ALL data for "${activeClient}"? This will delete all meetings, categories, and people. This cannot be undone.`,
      () => {
        const next = { meetings: [] as Meeting[], categories: [] as Category[], people: [] as Person[] };
        setData(next);
        save(next);
        setEditingMeeting(null);
      },
      { title: 'Clear Client Data', danger: true, confirmLabel: 'Clear All' }
    );
  }

  return (
    <div className="bg-app-gray min-h-screen">
      <AppHeader
        subtitle="Meeting Editor"
        activeClient={activeClient}
        clientList={clientList}
        clientDropdownOpen={clientDropdownOpen}
        onClientToggle={() => setClientDropdownOpen((o) => !o)}
        onClientClose={() => setClientDropdownOpen(false)}
        onClientSwitch={switchClient}
        onClientNew={handleNewClient}
        onClientRename={handleRenameClient}
        onClientDelete={handleDeleteClient}
      >
        <button
          type="button"
          onClick={() => setDataModalOpen(true)}
          className="flex items-center gap-2 bg-white text-app-dark border border-app-border rounded-md px-3.5 py-1.5 text-sm hover:bg-[#F0F8FB] transition-colors cursor-pointer"
        >
          <HiArrowDownTray className="w-4 h-4" />
          Data
        </button>
        <Link
          href="/"
          className="flex items-center gap-2 bg-app-blue text-white rounded-md px-3.5 py-1.5 text-sm font-semibold hover:bg-app-navy transition-colors cursor-pointer"
        >
          <HiCalendarDays className="w-4 h-4" />
          View Calendar
        </Link>
      </AppHeader>

      {/* Data Modal */}
      <DataModal
        open={dataModalOpen}
        onClose={() => setDataModalOpen(false)}
        onExport={handleExport}
        onImport={handleImportClick}
        onClear={handleClearData}
      />
      <input
        ref={importInputRef}
        type="file"
        accept=".json,application/json"
        className="hidden"
        onChange={handleImportFile}
      />

      {/* Dialog modals */}
      <AlertModal
        show={dialog.type === 'alert'}
        title={dialog.type === 'alert' ? dialog.title : undefined}
        message={dialog.type === 'alert' ? dialog.message : ''}
        onClose={closeDialog}
      />
      <ConfirmModal
        show={dialog.type === 'confirm'}
        title={dialog.type === 'confirm' ? dialog.title : undefined}
        message={dialog.type === 'confirm' ? dialog.message : ''}
        confirmLabel={dialog.type === 'confirm' ? dialog.confirmLabel : undefined}
        cancelLabel={dialog.type === 'confirm' ? dialog.cancelLabel : undefined}
        danger={dialog.type === 'confirm' ? dialog.danger : false}
        onConfirm={() => { if (dialog.type === 'confirm') { dialog.onConfirm(); closeDialog(); } }}
        onCancel={() => { if (dialog.type === 'confirm') { dialog.onCancel?.(); closeDialog(); } }}
      />
      <PromptModal
        show={dialog.type === 'prompt'}
        title={dialog.type === 'prompt' ? dialog.title : undefined}
        message={dialog.type === 'prompt' ? dialog.message : undefined}
        defaultValue={dialog.type === 'prompt' ? dialog.defaultValue : undefined}
        onConfirm={(value) => { if (dialog.type === 'prompt') { closeDialog(); dialog.onConfirm(value); } }}
        onCancel={closeDialog}
      />

      <div className="max-w-screen-2xl mx-auto px-6 py-6 space-y-6">
        {/* Categories + People side by side */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <CategoryManager
            categories={categories}
            onAdd={handleAddCategory}
            onDelete={handleDeleteCategory}
          />
          <PeopleManager
            people={people}
            onAdd={handleAddPerson}
            onDelete={handleDeletePerson}
          />
        </div>

        {/* Meeting Form */}
        <MeetingForm
          categories={categories}
          people={people}
          editingMeeting={editingMeeting}
          onSave={handleSaveMeeting}
          onClear={() => setEditingMeeting(null)}
        />

        {/* Meetings Table */}
        <MeetingsTable
          meetings={meetings}
          categories={categories}
          onEdit={handleEditMeeting}
          onDelete={handleDeleteMeeting}
        />
      </div>
    </div>
  );
}
