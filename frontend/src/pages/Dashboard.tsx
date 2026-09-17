import { useState } from "react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ConfusionMatrix } from "../components/ConfusionMatrix";
import { MetricCard } from "../components/MetricCard";
import { ParameterField } from "../components/ParameterField";
import { ProbabilityGauge } from "../components/ProbabilityGauge";
import { predictBattery } from "../services/api";
import { emptyFormValues, featureDefinitions, type FeatureKey, type FormValues, type PredictionResult } from "../types/prediction";

const groups = ["Battery Condition", "Usage", "Thermal", "History"] as const;
const evaluationData = [
  { name: "Accuracy", value: 97.07 },
  { name: "Precision", value: 84.85 },
  { name: "Recall", value: 59.57 },
  { name: "F1", value: 70 },
  { name: "ROC-AUC", value: 98.23 },
];

export function Dashboard() {
  const [values, setValues] = useState<FormValues>(emptyFormValues);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const updateValue = (key: FeatureKey, value: string) => setValues((current) => ({ ...current, [key]: value }));

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const payload = Object.fromEntries(
        featureDefinitions.map(({ key }) => [key, Number(values[key])]),
      ) as Record<FeatureKey, number>;
      setResult(await predictBattery(payload));
    } catch (requestError) {
      setResult(null);
      setError(requestError instanceof Error ? requestError.message : "Unable to reach the prediction service.");
    } finally {
      setIsLoading(false);
    }
  }

  const isFailure = result?.prediction === 1;

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand-lockup"><span className="brand-mark">+</span><div><strong>EV BATTERY</strong><span>INTELLIGENCE</span></div></div>
        <div className="status-pill"><span className="status-dot" /> INFERENCE ENGINE ONLINE</div>
      </header>

      <section className="hero-intro">
        <div><p className="eyebrow">DIAGNOSTIC CONSOLE / 01</p><h1>EV Battery<br /><em>Intelligence</em></h1></div>
        <div className="hero-copy"><span className="hero-line" /><p>Machine Learning Based<br />Battery Failure Prediction</p></div>
      </section>

      <section className="predictor-grid">
        <form className="panel parameters-panel" onSubmit={handleSubmit}>
          <div className="panel-heading"><div><span className="section-index">01</span><h2>Battery Parameters</h2></div><span className="required-note">ALL FIELDS REQUIRED</span></div>
          <p className="panel-description">Enter telemetry from the vehicle battery pack to run a model-backed diagnostic.</p>
          <div className="parameter-groups">
            {groups.map((group) => <fieldset key={group}><legend>{group}</legend><div className="field-grid">{featureDefinitions.filter((field) => field.group === group).map((field) => <ParameterField key={field.key} field={field} values={values} onChange={updateValue} />)}</div></fieldset>)}
          </div>
          <button className="analyze-button" type="submit" disabled={isLoading}>{isLoading ? <><span className="spinner" /> ANALYZING SIGNAL</> : <>ANALYZE BATTERY <span>↗</span></>}</button>
        </form>

        <section className={`panel prediction-panel ${result ? (isFailure ? "failure" : "healthy") : "idle"}`}>
          <div className="panel-heading"><div><span className="section-index">02</span><h2>Prediction</h2></div><span className="model-tag">LDA / LIVE</span></div>
          {!result && !error && <div className="empty-prediction"><div className="radar-icon"><span /><span /><span /></div><p>Enter battery parameters<br />to run diagnostics.</p></div>}
          {error && <div className="error-state"><span>!</span><h3>Prediction unavailable</h3><p>{error}</p><small>Check that the FastAPI service is running and the model file is present.</small></div>}
          {result && <div className="result-state"><div className="result-badge">{isFailure ? "!" : "✓"}</div><p className="result-kicker">DIAGNOSTIC RESULT</p><h3>{isFailure ? "Failure Risk" : "No Failure Detected"}</h3><p className="result-summary">{isFailure ? "The model identified a high-risk battery signature." : "The model found no failure signature in this reading."}</p><div className="probability-block"><div className="probability-title"><span>Failure Probability</span><strong>{result.failure_probability === null ? "--" : `${Math.round(result.failure_probability * 100)}%`}</strong></div><ProbabilityGauge probability={result.failure_probability} /></div></div>}
        </section>
      </section>

      <section className="evaluation-section"><div className="section-heading"><div><p className="eyebrow">MODEL VALIDATION / 02</p><h2>Model Evaluation</h2></div><p>Linear Discriminant Analysis<br /><span>Holdout test set performance</span></p></div>
        <div className="evaluation-grid"><div className="metrics-grid">{[["Accuracy", "97.07%", "overall correctness"], ["Precision", "84.85%", "positive prediction quality"], ["Recall", "59.57%", "failure detection rate"], ["F1 Score", "70.00%", "balanced measure"], ["ROC-AUC", "98.23%", "ranking performance"]].map(([label, value, detail]) => <MetricCard key={label} label={label} value={value} detail={detail} />)}</div><div className="chart-panel"><div className="chart-title"><span>Performance profile</span><small>0 - 100%</small></div><ResponsiveContainer width="100%" height={180}><BarChart data={evaluationData} margin={{ top: 12, right: 4, left: -24, bottom: 0 }}><XAxis dataKey="name" tick={{ fill: "#899394", fontSize: 10 }} axisLine={false} tickLine={false} /><YAxis domain={[0, 100]} tick={{ fill: "#596466", fontSize: 10 }} axisLine={false} tickLine={false} /><Tooltip cursor={{ fill: "rgba(170, 244, 74, .06)" }} contentStyle={{ background: "#1b2222", border: "1px solid #374141", borderRadius: 4, color: "#f4f7f2" }} formatter={(value) => [`${value}%`, "Score"]} /><Bar dataKey="value" fill="#b8f56a" radius={[2, 2, 0, 0]} barSize={25} /></BarChart></ResponsiveContainer></div></div>
        <div className="matrix-panel"><div className="matrix-heading"><div><span className="section-index">03</span><h3>Confusion Matrix</h3></div><span>1,638 TEST SAMPLES</span></div><ConfusionMatrix /></div>
      </section>
      <footer><span>EV BATTERY INTELLIGENCE</span><span>INFERENCE ONLY · NO MODEL TRAINING IN APP</span></footer>
    </main>
  );
}
