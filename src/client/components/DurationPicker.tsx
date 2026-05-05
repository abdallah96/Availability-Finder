import { useEffect, useState } from "react";

interface DurationPickerProps {
  durationMinutes: number;
  onChange: (durationMinutes: number) => void;
}

const PRESETS = [30, 45, 60, 90] as const;
const MIN_MINUTES = 15;
const MAX_MINUTES = 240;

function clampMinutes(value: number): number {
  return Math.min(MAX_MINUTES, Math.max(MIN_MINUTES, Math.round(value)));
}

function parseMinutes(raw: string): number | null {
  const trimmed = raw.trim();
  if (trimmed === "") {
    return null;
  }
  const n = Number.parseInt(trimmed, 10);
  if (!Number.isFinite(n)) {
    return null;
  }
  return n;
}

export function DurationPicker({ durationMinutes, onChange }: DurationPickerProps) {
  const [draft, setDraft] = useState(String(durationMinutes));

  useEffect(() => {
    setDraft(String(durationMinutes));
  }, [durationMinutes]);

  function commitDraft() {
    const parsed = parseMinutes(draft);
    if (parsed === null) {
      setDraft(String(durationMinutes));
      return;
    }
    onChange(clampMinutes(parsed));
  }

  return (
    <section className="panel">
      <div className="section-heading">
        <h2>Duration</h2>
        <p>Presets or any length between {MIN_MINUTES} and {MAX_MINUTES} minutes.</p>
      </div>

      <div className="duration-controls">
        <div className="duration-presets" role="group" aria-label="Quick duration presets">
          {PRESETS.map((minutes) => (
            <button
              className={durationMinutes === minutes ? "active" : ""}
              key={minutes}
              onClick={() => onChange(minutes)}
              type="button"
            >
              {minutes} min
            </button>
          ))}
        </div>

        <label className="duration-manual">
          <span className="duration-manual-label">Minutes</span>
          <input
            aria-label="Meeting duration in minutes"
            className="duration-input"
            inputMode="numeric"
            max={MAX_MINUTES}
            min={MIN_MINUTES}
            onBlur={commitDraft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                (event.target as HTMLInputElement).blur();
              }
            }}
            type="number"
            value={draft}
          />
        </label>
      </div>
    </section>
  );
}
