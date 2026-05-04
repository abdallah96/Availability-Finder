export type PersonId = "greta" | "abdallah" | "habib" | "leon" | "timmo";

export interface WorkingHours {
  start: string;
  end: string;
}

export interface Person {
  id: PersonId;
  name: string;
  role: string;
  color: string;
  workingHours: WorkingHours;
}

export interface CalendarEvent {
  id: string;
  personId: PersonId;
  title?: string;
  start?: string;
  end?: string;
  location?: string;
}

export interface AvailabilityRequest {
  personIds: PersonId[];
  durationMinutes: number;
}

export interface TimeSlot {
  start: string;
  end: string;
  label: string;
}

export interface EventIssue {
  eventId: string;
  personId: PersonId;
  message: string;
}

export interface AvailabilityResponse {
  date: string;
  durationMinutes: number;
  selectedPeople: Person[];
  slots: TimeSlot[];
  ignoredEvents: EventIssue[];
  assumptions: string[];
}
