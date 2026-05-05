import type { Person, PersonId } from "../../shared/types";

interface PersonSelectorProps {
  people: Person[];
  selectedIds: PersonId[];
  onToggle: (personId: PersonId) => void;
}

export function PersonSelector({ people, selectedIds, onToggle }: PersonSelectorProps) {
  return (
    <section className="panel">
      <div className="section-heading">
        <h2>Attendees</h2>
        <p>Required for the slot search.</p>
      </div>

      <div className="person-grid">
        {people.map((person) => {
          const checked = selectedIds.includes(person.id);
          return (
            <label className={`person-card ${checked ? "selected" : ""}`} key={person.id}>
              <input type="checkbox" checked={checked} onChange={() => onToggle(person.id)} />
              <span className="person-dot" style={{ background: person.color }} />
              <span>
                <strong>{person.name}</strong>
                <small>{person.role}</small>
                <span className="hours">
                  {person.workingHours.start}–{person.workingHours.end}
                </span>
              </span>
            </label>
          );
        })}
      </div>
    </section>
  );
}
