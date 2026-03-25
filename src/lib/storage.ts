import type { ClientData, Meeting, Category, Person } from './types';

const CLIENTS_INDEX_KEY = 'meeting_calendar:clients';
const ACTIVE_KEY = 'meeting_calendar:active';

function clientStorageKey(name: string): string {
  return `meeting_calendar:${name}`;
}

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

export function getClientList(): string[] {
  if (!isBrowser()) return [];
  try {
    return JSON.parse(localStorage.getItem(CLIENTS_INDEX_KEY) || '[]') as string[];
  } catch {
    return [];
  }
}

export function saveClientList(list: string[]): void {
  if (!isBrowser()) return;
  localStorage.setItem(CLIENTS_INDEX_KEY, JSON.stringify(list));
}

export function getActiveClient(): string | null {
  if (!isBrowser()) return null;
  return localStorage.getItem(ACTIVE_KEY);
}

export function setActiveClient(name: string): void {
  if (!isBrowser()) return;
  localStorage.setItem(ACTIVE_KEY, name);
}

export function loadClientData(name: string): ClientData {
  const empty: ClientData = { meetings: [], categories: [], people: [] };
  if (!isBrowser() || !name) return empty;
  try {
    const raw = localStorage.getItem(clientStorageKey(name));
    if (!raw) return empty;
    const data = JSON.parse(raw) as Partial<ClientData>;
    return {
      meetings: data.meetings || [],
      categories: data.categories || [],
      people: data.people || [],
    };
  } catch {
    return empty;
  }
}

export function saveClientData(name: string, data: ClientData): void {
  if (!isBrowser() || !name) return;
  localStorage.setItem(clientStorageKey(name), JSON.stringify(data));
}

export function createClient(name: string): void {
  const list = getClientList();
  if (list.includes(name)) return;
  list.push(name);
  saveClientList(list);
  saveClientData(name, { meetings: [], categories: [], people: [] });
}

export function renameClient(oldName: string, newName: string): void {
  const list = getClientList();
  saveClientData(newName, loadClientData(oldName));
  if (isBrowser()) localStorage.removeItem(clientStorageKey(oldName));
  const idx = list.indexOf(oldName);
  if (idx >= 0) list[idx] = newName;
  saveClientList(list);
  if (getActiveClient() === oldName) setActiveClient(newName);
}

export function deleteClient(name: string): void {
  const list = getClientList().filter((c) => c !== name);
  saveClientList(list);
  localStorage.removeItem(clientStorageKey(name));
}

export function resolveActiveClient(): string | null {
  const list = getClientList();
  const saved = getActiveClient();
  if (saved && list.includes(saved)) return saved;
  if (list.length > 0) {
    setActiveClient(list[0]);
    return list[0];
  }
  return null;
}

export function exportJSON(
  clientName: string,
  meetings: Meeting[],
  categories: Category[],
  people: Person[]
): void {
  const today = new Date().toISOString().slice(0, 10);
  const slug = clientName.replace(/[^a-z0-9]/gi, '-').toLowerCase();
  const payload = JSON.stringify({ client: clientName, meetings, categories, people }, null, 2);
  const blob = new Blob([payload], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `meetings-${slug}-${today}.json`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
