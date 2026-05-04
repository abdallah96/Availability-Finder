interface AssumptionsPanelProps {
  assumptions: string[];
}

export function AssumptionsPanel({ assumptions }: AssumptionsPanelProps) {
  return (
    <aside className="assumptions">
      <strong>Scope choices</strong>
      {assumptions.map((assumption) => (
        <span key={assumption}>{assumption}</span>
      ))}
    </aside>
  );
}
