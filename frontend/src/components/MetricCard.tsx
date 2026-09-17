type Props = { label: string; value: string; detail: string };

export function MetricCard({ label, value, detail }: Props) {
  return <div className="metric-card"><span>{label}</span><strong>{value}</strong><small>{detail}</small></div>;
}
