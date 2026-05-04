import type { CalendarEvent, Person, PersonId } from "../../shared/types";

interface EventTimelineProps {
  people: Person[];
  events: CalendarEvent[];
  selectedIds: PersonId[];
}

export function EventTimeline({ people, events, selectedIds }: EventTimelineProps) {
  const visiblePeople = people.filter((person) => selectedIds.includes(person.id));

  return (
    <section className="panel event-panel">
      <div className="section-heading">
        <span>3</span>
        <div>
          <h2>Calendar Events</h2>
          <p>Messy data is shown as received, then cleaned on the server.</p>
        </div>
      </div>

      <div className="timeline">
        {visiblePeople.map((person) => (
          <div className="timeline-row" key={person.id}>
            <div className="timeline-person">
              <span className="person-dot" style={{ background: person.color }} />
              <strong>{person.name}</strong>
            </div>
            <div className="event-list">
              {events
                .filter((event) => event.personId === person.id)
                .map((event) => (
                  <article className={`event-card ${isInvalidEvent(event) ? "invalid" : ""}`} key={event.id}>
                    <strong>{event.title ?? "Untitled event"}</strong>
                    <span>
                      {event.start ?? "Missing start"} - {event.end ?? "Missing end"}
                    </span>
                    {isInvalidEvent(event) ? <small>Needs validation</small> : null}
                  </article>
                ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function isInvalidEvent(event: CalendarEvent): boolean {
  const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;
  return !event.start || !event.end || !timePattern.test(event.start) || !timePattern.test(event.end) || event.start >= event.end;
}
