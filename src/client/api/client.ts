import type { AvailabilityRequest, AvailabilityResponse, CalendarEvent, Person } from "../../shared/types";

async function getJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    headers: { "Content-Type": "application/json" },
    ...init
  });

  if (!response.ok) {
    const error = (await response.json().catch(() => ({ message: "Unexpected API error." }))) as { message?: string };
    throw new Error(error.message ?? "Unexpected API error.");
  }

  return response.json() as Promise<T>;
}

export function fetchPeople(): Promise<Person[]> {
  return getJson<Person[]>("/api/people");
}

export function fetchEvents(): Promise<CalendarEvent[]> {
  return getJson<CalendarEvent[]>("/api/events");
}

export function fetchAvailability(request: AvailabilityRequest): Promise<AvailabilityResponse> {
  return getJson<AvailabilityResponse>("/api/availability", {
    method: "POST",
    body: JSON.stringify(request)
  });
}
