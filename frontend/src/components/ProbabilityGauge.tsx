type Props = { probability: number | null };

export function ProbabilityGauge({ probability }: Props) {
  if (probability === null) {
    return <p className="probability-unavailable">Probability unavailable for this model.</p>;
  }

  const percent = Math.round(probability * 100);
  return (
    <div className="gauge-wrap" aria-label={`Failure probability ${percent}%`}>
      <div className="gauge-track">
        <div className="gauge-fill" style={{ width: `${Math.min(100, Math.max(0, percent))}%` }} />
      </div>
      <div className="gauge-scale"><span>0%</span><strong>{percent}%</strong><span>100%</span></div>
    </div>
  );
}
