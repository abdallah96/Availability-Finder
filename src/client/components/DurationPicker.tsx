interface DurationPickerProps {
  durationMinutes: number;
  onChange: (durationMinutes: number) => void;
}

const durationOptions = [15, 30, 45, 60, 90, 120];

export function DurationPicker({ durationMinutes, onChange }: DurationPickerProps) {
  return (
    <section className="panel">
      <div className="section-heading">
        <span>2</span>
        <div>
          <h2>Meeting Length</h2>
          <p>Pick one duration for the search.</p>
        </div>
      </div>

      <div className="duration-list" role="list" aria-label="Meeting duration">
        {durationOptions.map((option) => (
          <button className={durationMinutes === option ? "active" : ""} key={option} onClick={() => onChange(option)} type="button">
            {option} min
          </button>
        ))}
      </div>
    </section>
  );
}
