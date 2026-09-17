const cells = [
  { term: "TN", value: "1,534", label: "True Negative", tone: "good" },
  { term: "FP", value: "10", label: "False Positive", tone: "warn" },
  { term: "FN", value: "38", label: "False Negative", tone: "warn" },
  { term: "TP", value: "56", label: "True Positive", tone: "good" },
];

export function ConfusionMatrix() {
  return (
    <div className="matrix-layout">
      <div className="matrix-y-label">ACTUAL</div>
      <div className="matrix-content">
        <div className="matrix-x-label">PREDICTED</div>
        <div className="matrix-columns"><span>No Failure</span><span>Failure</span></div>
        <div className="matrix-row"><span className="matrix-row-label">No Failure</span>{cells.slice(0, 2).map((cell) => <MatrixCell key={cell.term} {...cell} />)}</div>
        <div className="matrix-row"><span className="matrix-row-label">Failure</span>{cells.slice(2).map((cell) => <MatrixCell key={cell.term} {...cell} />)}</div>
      </div>
    </div>
  );
}

function MatrixCell({ term, value, label, tone }: (typeof cells)[number]) {
  return <div className={`matrix-cell ${tone}`}><span>{term}</span><strong>{value}</strong><small>{label}</small></div>;
}
