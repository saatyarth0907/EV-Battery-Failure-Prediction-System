import type { PredictionPayload, PredictionResult } from "../types/prediction";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export async function predictBattery(payload: PredictionPayload): Promise<PredictionResult> {
  const response = await fetch(`${API_URL}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const body = (await response.json().catch(() => null)) as { detail?: string } | PredictionResult | null;
  if (!response.ok) {
    throw new Error(body && "detail" in body ? body.detail : "The prediction service is unavailable.");
  }

  return body as PredictionResult;
}
