import { calendarEvents, meetingDate, people } from "../data/calendarSeed";
import type { AvailabilityRequest, AvailabilityResponse, CalendarEvent, EventIssue, Person, TimeSlot } from "../../shared/types";
import { clampRange, formatRange, minutesToClockTime, parseClockTime, rangesOverlap, SLOT_STEP_MINUTES, type MinuteRange } from "../../shared/time";

const assumptions = [
  "One-day schedule, no recurring events.",
  "Times use local 24-hour HH:mm format.",
  "Busy events are merged when overlapping or touching.",
  "Invalid events are ignored and reported instead of blocking the search.",
  `Meeting starts snap to ${SLOT_STEP_MINUTES}-minute increments.`
];

interface NormalizedEvent {
  event: CalendarEvent;
  range: MinuteRange;
}

export function findAvailability(request: AvailabilityRequest): AvailabilityResponse {
  const selectedPeople = people.filter((person) => request.personIds.includes(person.id));

  if (selectedPeople.length === 0) {
    return buildResponse(request, [], [], []);
  }

  const allIssues: EventIssue[] = [];
  const freeByPerson = selectedPeople.map((person) => {
    const { events, issues } = normalizeEventsForPerson(person, calendarEvents);
    allIssues.push(...issues);
    return subtractBusyRanges(parseWorkingHours(person), mergeRanges(events.map(({ range }) => range)));
  });

  const [firstFree, ...restFree] = freeByPerson;
  const commonFreeRanges = restFree.reduce<MinuteRange[]>(
    (current, ranges) => intersectRanges(current, ranges),
    firstFree
  );

  const slots = expandRangesToSlots(commonFreeRanges, request.durationMinutes);

  return buildResponse(request, selectedPeople, slots, allIssues);
}

function buildResponse(
  request: AvailabilityRequest,
  selectedPeople: Person[],
  slots: TimeSlot[],
  ignoredEvents: EventIssue[]
): AvailabilityResponse {
  return {
    date: meetingDate,
    durationMinutes: request.durationMinutes,
    selectedPeople,
    slots,
    ignoredEvents,
    assumptions
  };
}

function normalizeEventsForPerson(person: Person, events: CalendarEvent[]): { events: NormalizedEvent[]; issues: EventIssue[] } {
  const workingHours = parseWorkingHours(person);
  const normalized: NormalizedEvent[] = [];
  const issues: EventIssue[] = [];

  for (const event of events.filter((item) => item.personId === person.id)) {
    const start = event.start ? parseClockTime(event.start) : null;
    const end = event.end ? parseClockTime(event.end) : null;

    if (start === null || end === null) {
      issues.push({ eventId: event.id, personId: event.personId, message: "Missing or invalid start/end time." });
      continue;
    }

    if (start >= end) {
      issues.push({ eventId: event.id, personId: event.personId, message: "Start time must be before end time." });
      continue;
    }

    const clamped = clampRange({ start, end }, workingHours);
    if (clamped) {
      normalized.push({ event, range: clamped });
    }
  }

  return { events: normalized, issues };
}

function parseWorkingHours(person: Person): MinuteRange {
  const start = parseClockTime(person.workingHours.start);
  const end = parseClockTime(person.workingHours.end);

  if (start === null || end === null || start >= end) {
    throw new Error(`Invalid working hours for ${person.name}`);
  }

  return { start, end };
}

function mergeRanges(ranges: MinuteRange[]): MinuteRange[] {
  const sorted = [...ranges].sort((a, b) => a.start - b.start);
  const merged: MinuteRange[] = [];

  for (const range of sorted) {
    const previous = merged.at(-1);
    if (previous && range.start <= previous.end) {
      previous.end = Math.max(previous.end, range.end);
    } else {
      merged.push({ ...range });
    }
  }

  return merged;
}

function subtractBusyRanges(workingHours: MinuteRange, busyRanges: MinuteRange[]): MinuteRange[] {
  const freeRanges: MinuteRange[] = [];
  let cursor = workingHours.start;

  for (const busy of busyRanges) {
    if (busy.start > cursor) {
      freeRanges.push({ start: cursor, end: busy.start });
    }
    cursor = Math.max(cursor, busy.end);
  }

  if (cursor < workingHours.end) {
    freeRanges.push({ start: cursor, end: workingHours.end });
  }

  return freeRanges;
}

function intersectRanges(left: MinuteRange[], right: MinuteRange[]): MinuteRange[] {
  const intersections: MinuteRange[] = [];

  for (const a of left) {
    for (const b of right) {
      if (!rangesOverlap(a, b)) {
        continue;
      }
      intersections.push({ start: Math.max(a.start, b.start), end: Math.min(a.end, b.end) });
    }
  }

  return mergeRanges(intersections);
}

function expandRangesToSlots(ranges: MinuteRange[], durationMinutes: number): TimeSlot[] {
  if (!Number.isInteger(durationMinutes) || durationMinutes <= 0) {
    return [];
  }

  return ranges.flatMap((range) => {
    const slots: TimeSlot[] = [];
    const firstStart = Math.ceil(range.start / SLOT_STEP_MINUTES) * SLOT_STEP_MINUTES;

    for (let start = firstStart; start + durationMinutes <= range.end; start += SLOT_STEP_MINUTES) {
      const slotRange = { start, end: start + durationMinutes };
      slots.push({
        start: minutesToClockTime(slotRange.start),
        end: minutesToClockTime(slotRange.end),
        label: formatRange(slotRange)
      });
    }

    return slots;
  });
}
