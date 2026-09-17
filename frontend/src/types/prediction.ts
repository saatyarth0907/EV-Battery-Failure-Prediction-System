export const featureDefinitions = [
  { key: "battery_health_percent", label: "Battery Health", unit: "%", group: "Battery Condition" },
  { key: "capacity_loss_percent", label: "Capacity Loss", unit: "%", group: "Battery Condition" },
  { key: "internal_resistance", label: "Internal Resistance", unit: "ohm", group: "Battery Condition" },
  { key: "cycle_count", label: "Cycle Count", unit: "cycles", group: "Usage" },
  { key: "vehicle_age_years", label: "Vehicle Age", unit: "years", group: "Usage" },
  { key: "cell_temperature_max", label: "Maximum Cell Temperature", unit: "C", group: "Thermal" },
  { key: "BMS_warning_count", label: "BMS Warnings", unit: "events", group: "History" },
] as const;

export type FeatureKey = (typeof featureDefinitions)[number]["key"];
export type PredictionPayload = Record<FeatureKey, number>;

export interface PredictionResult {
  prediction: 0 | 1;
  label: string;
  failure_probability: number | null;
}

export type FormValues = Record<FeatureKey, string>;

export const emptyFormValues = (): FormValues =>
  Object.fromEntries(featureDefinitions.map(({ key }) => [key, ""])) as FormValues;
