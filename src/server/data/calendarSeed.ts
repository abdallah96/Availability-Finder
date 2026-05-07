import type { CalendarEvent, Person } from "../../shared/types";

export const meetingDate = "2026-05-05";

export const people: Person[] = [
  {
    id: "greta",
    name: "Greta",
    role: "People Partner",
    color: "#c2410c",
    workingHours: { start: "09:00", end: "17:00" }
  },
  {
    id: "abdallah",
    name: "Abdallah",
    role: "Full-stack TypeScript developer",
    color: "#2563eb",
    workingHours: { start: "10:00", end: "18:00" }
  },
  {
    id: "habib",
    name: "Habib",
    role: "Team Lead",
    color: "#16a34a",
    workingHours: { start: "08:30", end: "16:30" }
  },
  {
    id: "leon",
    name: "Leon",
    role: "HR",
    color: "#9333ea",
    workingHours: { start: "11:00", end: "19:00" }
  },
  {
    id: "timmo",
    name: "Timo",
    role: "Staff Engineer",
    color: "#0f766e",
    workingHours: { start: "09:30", end: "15:30" }
  }
];

export const calendarEvents: CalendarEvent[] = [
  { id: "evt-1", personId: "greta", title: "Customer discovery", start: "14:00", end: "14:45" },
  { id: "evt-2", personId: "greta", title: "Roadmap sync", start: "09:30", end: "10:30" },
  { id: "evt-3", personId: "greta", title: "Partner review", start: "10:15", end: "11:00" },
  { id: "evt-4", personId: "abdallah", title: "Build review", start: "10:00", end: "11:15" },
  { id: "evt-5", personId: "abdallah", title: "Focus block", start: "15:00", end: "16:00" },
  { id: "evt-6", personId: "abdallah", start: "12:00", end: "12:30" },
  { id: "evt-7", personId: "habib", title: "Database maintenance", start: "08:45", end: "09:30" },
  { id: "evt-8", personId: "habib", title: "API pairing", start: "13:30", end: "14:45" },
  { id: "evt-9", personId: "habib", title: "Broken import", start: "15:30", end: "14:50" },
  { id: "evt-10", personId: "leon", title: "Policy briefing", start: "11:30", end: "12:30" },
  { id: "evt-11", personId: "leon", title: "Hiring sync", start: "16:00", end: "17:00" },
  { id: "evt-12", personId: "leon", title: "Missing finish", start: "14:00" },
  { id: "evt-13", personId: "timmo", title: "Regression plan", start: "09:30", end: "10:15" },
  { id: "evt-14", personId: "timmo", start: "12:00", end: "12:45", location: "Remote" },
  { id: "evt-15", personId: "timmo", title: "Release verification", start: "14:30", end: "15:15" },
  { id: "evt-16", personId: "greta", title: "Typo time", start: "25:00", end: "26:00" }
];
