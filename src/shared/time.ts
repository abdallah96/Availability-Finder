const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const SLOT_STEP_MINUTES = 15;

export interface MinuteRange {
  start: number;
  end: number;
}

export function parseClockTime(value: string): number | null {
  const match = TIME_PATTERN.exec(value);
  if (!match) {
    return null;
  }

  return Number(match[1]) * 60 + Number(match[2]);
}

export function minutesToClockTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
}

export function formatRange(range: MinuteRange): string {
  return `${minutesToClockTime(range.start)} - ${minutesToClockTime(range.end)}`;
}

export function rangesOverlap(a: MinuteRange, b: MinuteRange): boolean {
  return a.start < b.end && b.start < a.end;
}

export function clampRange(range: MinuteRange, boundary: MinuteRange): MinuteRange | null {
  const start = Math.max(range.start, boundary.start);
  const end = Math.min(range.end, boundary.end);
  return start < end ? { start, end } : null;
}
