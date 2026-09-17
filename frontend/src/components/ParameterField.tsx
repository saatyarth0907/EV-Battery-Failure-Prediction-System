import type { FeatureKey, FormValues } from "../types/prediction";

type Props = {
  field: { key: FeatureKey; label: string; unit: string };
  values: FormValues;
  onChange: (key: FeatureKey, value: string) => void;
};

export function ParameterField({ field, values, onChange }: Props) {
  return (
    <label className="parameter-field">
      <span className="field-label">{field.label}</span>
      <span className="input-wrap">
        <input
          type="number"
          min="0"
          step="any"
          value={values[field.key]}
          onChange={(event) => onChange(field.key, event.target.value)}
          placeholder="--"
          required
        />
        <span className="field-unit">{field.unit}</span>
      </span>
    </label>
  );
}
