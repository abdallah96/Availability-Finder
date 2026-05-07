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
        <h2>Slots</h2>
        <p>Everyone selected is free for the full block.</p>
      </div>

      {loading ? <div className="empty-state">Calculating…</div> : null}
      {error ? <div className="error-state">{error}</div> : null}

      {!loading && !error && availability ? (
        <>
          <div className="result-summary">
            <strong>{availability.slots.length}</strong>
            <span>
              {availability.slots.length === 1 ? "slot" : "slots"} · {availability.durationMinutes} min ·{" "}
              {availability.date}
            </span>
          </div>

          <div className="slot-grid">
            {availability.slots.length > 0 ? (
              availability.slots.map((slot) => (
                <article className="slot-card" key={`${slot.start}-${slot.end}`}>
                  <span className="time-range">{slot.label}</span>
                  <small>{availability.selectedPeople.map((person) => person.name).join(", ")}</small>
                </article>
              ))
            ) : (
              <div className="empty-state">No shared availability for the current selection.</div>
            )}
          </div>
        </>
      ) : null}
    </section>
  );
}
