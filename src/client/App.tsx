import { useEffect, useState } from "react";
import { fetchAvailability, fetchEvents, fetchPeople } from "./api/client";
import { DurationPicker } from "./components/DurationPicker";
import { EventTimeline } from "./components/EventTimeline";
import { PersonSelector } from "./components/PersonSelector";
import { SlotResults } from "./components/SlotResults";
import { StartupLoader } from "./components/StartupLoader";
import type { AvailabilityResponse, CalendarEvent, Person, PersonId } from "../shared/types";

const startupMinMs = 2500;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function App() {
  const [people, setPeople] = useState<Person[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedIds, setSelectedIds] = useState<PersonId[]>([]);
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [availability, setAvailability] = useState<AvailabilityResponse | null>(null);
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [startupLoading, setStartupLoading] = useState(true);

  const logoSrc = `${import.meta.env.BASE_URL}tenhil-logo.png`;

  useEffect(() => {
    let mounted = true;

    Promise.all([fetchPeople(), fetchEvents(), delay(startupMinMs)])
      .then(([peopleResult, eventsResult]) => {
        if (!mounted) {
          return;
        }
        setPeople(peopleResult);
        setEvents(eventsResult);
      })
      .catch((reason: unknown) => {
        if (!mounted) {
          return;
        }
        setError(reason instanceof Error ? reason.message : "Could not load calendar data.");
      })
      .finally(() => {
        if (mounted) {
          setStartupLoading(false);
        }
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

  function togglePerson(personId: PersonId) {
    setSelectedIds((current) => (current.includes(personId) ? current.filter((id) => id !== personId) : [...current, personId]));
  }

  return (
    <main>
      {startupLoading ? <StartupLoader /> : null}
      <div className="app-shell">
        <header className="app-header">
          <img alt="Tenhil" className="app-header-logo" height={40} src={logoSrc} width={140} />
          <div className="app-header-copy">
            <h1>Availability Finder</h1>
          </div>
          <div aria-hidden className="app-header-spacer" />
        </header>

        <div className="layout">
          <div className="controls">
            <PersonSelector people={people} selectedIds={selectedIds} onSelectAll={() => setSelectedIds(people.map((p) => p.id))} onToggle={togglePerson} />
            <DurationPicker durationMinutes={durationMinutes} onChange={setDurationMinutes} />
          </div>

          <div className="workspace">
            <EventTimeline people={people} events={events} selectedIds={selectedIds} />
            <SlotResults availability={availability} loading={loadingAvailability} error={error} hasSelection={selectedIds.length > 0} />
          </div>
        </div>
      </div>
    </main>
  );
}
