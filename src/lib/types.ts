export type Cadence = 'weekly' | 'bi-weekly' | 'monthly' | 'one-time';

export interface Meeting {
  id: string;
  title: string;
  dayOfWeek: string[];
  startTime: string; // "HH:MM"
  endTime: string;   // "HH:MM"
  cadence: Cadence;
  category: string;
  categoryColor: string;
  attendees: string[];
  webexLink: string;
  description: string;
}

export interface Category {
  name: string;
  color: string;
}

export interface Person {
  name: string;
  role: string;
}

export interface ClientData {
  meetings: Meeting[];
  categories: Category[];
  people: Person[];
}

export const CADENCE_STYLES: Record<string, { bg: string; color: string }> = {
  'weekly':    { bg: '#D6F0D2', color: '#2A6B21' },
  'bi-weekly': { bg: '#D4E7ED', color: '#0D253A' },
  'monthly':   { bg: '#FFF0B3', color: '#7A5A00' },
  'one-time':  { bg: '#EAF6FB', color: '#11395B' },
};

export const CADENCE_LABELS: Record<string, string> = {
  weekly: 'Weekly',
  'bi-weekly': 'Bi-Weekly',
  monthly: 'Monthly',
  'one-time': 'One-Time',
};

export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
export const DAY_ABBR: Record<string, string> = {
  Monday: 'Mon', Tuesday: 'Tue', Wednesday: 'Wed', Thursday: 'Thu', Friday: 'Fri',
};
