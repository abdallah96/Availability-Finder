interface AssumptionsPanelProps {
  assumptions: string[];
}

export function AssumptionsPanel({ assumptions }: AssumptionsPanelProps) {
  return (
    <aside className="assumptions">
      <h3>Rules</h3>
      <ul>
        {assumptions.map((assumption) => (
          <li key={assumption}>{assumption}</li>
        ))}
      </ul>
    </aside>
  );
}
