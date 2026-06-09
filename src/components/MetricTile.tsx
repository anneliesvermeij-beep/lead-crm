interface MetricTileProps {
  label: string;
  waarde: number;
  toon?: 'danger' | 'success' | 'neutraal';
}

export function MetricTile({ label, waarde, toon = 'neutraal' }: MetricTileProps) {
  return (
    <div className="metric-tile">
      <div className={`metric-waarde metric-${toon}`}>{waarde}</div>
      <div className="metric-label">{label}</div>
    </div>
  );
}
