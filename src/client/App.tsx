import { useEffect, useMemo, useState } from "react";
import { fetchAvailability, fetchEvents, fetchPeople } from "./api/client";
import { AssumptionsPanel } from "./components/AssumptionsPanel";
import { DurationPicker } from "./components/DurationPicker";
import { EventTimeline } from "./components/EventTimeline";
import { PersonSelector } from "./components/PersonSelector";
import { SlotResults } from "./components/SlotResults";
import type { AvailabilityResponse, CalendarEvent, Person, PersonId } from "../shared/types";

const defaultAssumptions = [
  "One-day schedule, no recurring events.",
  "Times use local 24-hour HH:mm format.",
  "Invalid events are ignored and reported instead of blocking the search."
];

export function App() {
  const [people, setPeople] = useState<Person[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedIds, setSelectedIds] = useState<PersonId[]>([]);
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [availability, setAvailability] = useState<AvailabilityResponse | null>(null);
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    Promise.all([fetchPeople(), fetchEvents()])
      .then(([peopleResult, eventsResult]) => {
        if (!mounted) {
          return;
        }
        setPeople(peopleResult);
        setEvents(eventsResult);
        setSelectedIds(peopleResult.map((person) => person.id));
      })
      .catch((reason: unknown) => {
        setError(reason instanceof Error ? reason.message : "Could not load calendar data.");
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (selectedIds.length === 0) {
      setAvailability(null);
      return;
    }

    let mounted = true;
    setLoadingAvailability(true);
    setError(null);

    fetchAvailability({ personIds: selectedIds, durationMinutes })
      .then((result) => {
        if (mounted) {
          setAvailability(result);
        }
      })
      .catch((reason: unknown) => {
        if (mounted) {
          setError(reason instanceof Error ? reason.message : "Could not calculate availability.");
        }
      })
      .finally(() => {
        if (mounted) {
          setLoadingAvailability(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [durationMinutes, selectedIds]);

  const assumptions = useMemo(() => availability?.assumptions ?? defaultAssumptions, [availability]);

  function togglePerson(personId: PersonId) {
    setSelectedIds((current) => (current.includes(personId) ? current.filter((id) => id !== personId) : [...current, personId]));
  }

  return (
    <main>
      <div className="app-shell">
        <header className="app-header">
          <div className="app-header-brand">
            <img src="/tenhil-logo.png" alt="Tenhil" width={140} height={40} />
            <div className="app-header-titles">
              <h1>Availability</h1>
              <p>
                One-day view. Pick people and a duration; the server merges overlaps, clips to working hours, and drops
                invalid rows.
              </p>
            </div>
          </div>
          <div className="app-meta">Sample day: 2026-05-05</div>
        </header>

        <div className="layout">
          <div className="controls">
            <PersonSelector people={people} selectedIds={selectedIds} onToggle={togglePerson} />
            <DurationPicker durationMinutes={durationMinutes} onChange={setDurationMinutes} />
            <AssumptionsPanel assumptions={assumptions} />
          </div>

          <div className="workspace">
            <EventTimeline people={people} events={events} selectedIds={selectedIds} />
            <SlotResults availability={availability} loading={loadingAvailability} error={error} />
          </div>
        </div>
      </div>
    </main>
  );
}
