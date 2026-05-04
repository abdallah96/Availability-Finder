import type { AvailabilityResponse } from "../../shared/types";

interface SlotResultsProps {
  availability: AvailabilityResponse | null;
  loading: boolean;
  error: string | null;
}

export function SlotResults({ availability, loading, error }: SlotResultsProps) {
  return (
    <section className="panel result-panel">
      <div className="section-heading">
        <span>4</span>
        <div>
          <h2>Matching Slots</h2>
          <p>Everyone selected is free for the full duration.</p>
        </div>
      </div>

      {loading ? <div className="empty-state">Finding the cleanest options...</div> : null}
      {error ? <div className="error-state">{error}</div> : null}

      {!loading && !error && availability ? (
        <>
          <div className="result-summary">
            <strong>{availability.slots.length}</strong>
            <span>
              slots found for {availability.durationMinutes} minutes on {availability.date}
            </span>
          </div>

          <div className="slot-grid">
            {availability.slots.length > 0 ? (
              availability.slots.map((slot) => (
                <article className="slot-card" key={`${slot.start}-${slot.end}`}>
                  <span>{slot.start}</span>
                  <strong>{slot.label}</strong>
                  <small>Works for {availability.selectedPeople.map((person) => person.name).join(", ")}</small>
                </article>
              ))
            ) : (
              <div className="empty-state">No shared availability for the current selection.</div>
            )}
          </div>

          {availability.ignoredEvents.length > 0 ? (
            <div className="warning-box">
              <strong>Ignored messy events</strong>
              {availability.ignoredEvents.map((issue) => (
                <span key={`${issue.personId}-${issue.eventId}`}>
                  {issue.eventId}: {issue.message}
                </span>
              ))}
            </div>
          ) : null}
        </>
      ) : null}
    </section>
  );
}
