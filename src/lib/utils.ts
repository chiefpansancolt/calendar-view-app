import type { Meeting } from "./types";

export const DAY_START = 9;
export const DAY_END = 17;
export const PX_PER_HOUR = 120;
export const PX_PER_MIN = PX_PER_HOUR / 60;

export function fmt12(t: string): string {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
}

export function toMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

export function hexToLight(hex: string, alpha = 0.12): string {
  try {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  } catch {
    return "#f0f0f0";
  }
}

export function darkenHex(hex: string, amount = 0.3): string {
  try {
    const r = Math.round(parseInt(hex.slice(1, 3), 16) * (1 - amount));
    const g = Math.round(parseInt(hex.slice(3, 5), 16) * (1 - amount));
    const b = Math.round(parseInt(hex.slice(5, 7), 16) * (1 - amount));
    return `rgb(${r},${g},${b})`;
  } catch {
    return "#555";
  }
}

export function genId(): string {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export function normaliseDays(val: string | string[]): string[] {
  if (Array.isArray(val)) return val;
  if (typeof val === "string" && val) return [val];
  return [];
}

export interface LayoutItem {
  meeting: Meeting;
  top: number;
  height: number;
  left: number;
  width: number;
}

interface LayoutIntermediate {
  m: Meeting;
  startMin: number;
  endMin: number;
  slot?: number;
}

export function computeLayout(dayMeetings: Meeting[]): LayoutItem[] {
  if (!dayMeetings.length) return [];

  const items: LayoutIntermediate[] = dayMeetings
    .map((m) => {
      const startMin = Math.max(toMinutes(m.startTime), DAY_START * 60);
      const endMin = Math.min(toMinutes(m.endTime), DAY_END * 60);
      return { m, startMin, endMin: Math.max(endMin, startMin + 15) };
    })
    .filter((it) => it.startMin < it.endMin);

  items.sort((a, b) => a.startMin - b.startMin);

  const groups: LayoutIntermediate[][] = [];
  for (const item of items) {
    let placed = false;
    for (const group of groups) {
      if (
        group.some((g) => item.startMin < g.endMin && g.startMin < item.endMin)
      ) {
        group.push(item);
        placed = true;
        break;
      }
    }
    if (!placed) groups.push([item]);
  }

  const result: LayoutItem[] = [];
  for (const group of groups) {
    const colEnds: number[] = [];
    for (const item of group) {
      let slot = -1;
      for (let i = 0; i < colEnds.length; i++) {
        if (colEnds[i] <= item.startMin) {
          slot = i;
          break;
        }
      }
      if (slot === -1) {
        slot = colEnds.length;
        colEnds.push(0);
      }
      colEnds[slot] = item.endMin;
      item.slot = slot;
    }
    const slotCount = colEnds.length;
    for (const item of group) {
      const top = (item.startMin - DAY_START * 60) * PX_PER_MIN;
      const height = Math.max((item.endMin - item.startMin) * PX_PER_MIN, 20);
      const left = ((item.slot ?? 0) / slotCount) * 100;
      const width = (1 / slotCount) * 100 - 0.5;
      result.push({ meeting: item.m, top, height, left, width });
    }
  }
  return result;
}

export const RANDOM_COLORS = [
  "#17A7DA",
  "#11395B",
  "#0D253A",
  "#7BB3C5",
  "#5CB54D",
  "#FABA00",
  "#CD1012",
  "#7ECBE3",
  "#8EDB7A",
  "#FFDA2D",
  "#EA4A22",
  "#6366F1",
  "#8B5CF6",
  "#EC4899",
  "#14B8A6",
  "#F97316",
  "#84CC16",
  "#06B6D4",
  "#A855F7",
  "#EF4444",
];
