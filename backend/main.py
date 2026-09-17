from contextlib import asynccontextmanager
from pathlib import Path
from typing import Any, Optional

import joblib
import numpy as np
import pandas as pd
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ConfigDict, Field

from config import FEATURE_NAMES, MODEL_NAME, MODEL_PATH


class PredictionRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    battery_health_percent: float = Field(..., ge=0)
    capacity_loss_percent: float = Field(..., ge=0)
    internal_resistance: float = Field(..., ge=0)
    cycle_count: float = Field(..., ge=0)
    cell_temperature_max: float
    vehicle_age_years: float = Field(..., ge=0)
    BMS_warning_count: float = Field(..., ge=0)


class PredictionResponse(BaseModel):
    prediction: int
    label: str
    failure_probability: Optional[float]


class HealthResponse(BaseModel):
    status: str
    model_loaded: bool


def load_model() -> Any:
    if not Path(MODEL_PATH).exists():
        raise FileNotFoundError(f"Model file not found at {MODEL_PATH}")
    return joblib.load(MODEL_PATH)


@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.model = None
    app.state.model_error = None
    try:
        app.state.model = load_model()
    except Exception as error:
        app.state.model_error = str(error)
    yield


app = FastAPI(
    title="EV Battery Failure Prediction API",
    description="Inference-only API for a saved EV battery failure model.",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def make_input_frame(payload: PredictionRequest) -> pd.DataFrame:
    values = payload.model_dump()
    return pd.DataFrame([{feature_name: values[feature_name] for feature_name in FEATURE_NAMES}], columns=FEATURE_NAMES)


def scalarize(value: Any) -> Any:
    if isinstance(value, np.ndarray):
        return value.item() if value.size == 1 else value[0]
    if isinstance(value, (np.generic,)):
        return value.item()
    return value


@app.get("/health", response_model=HealthResponse)
def health(request: Request) -> HealthResponse:
    return HealthResponse(status="ok", model_loaded=request.app.state.model is not None)


@app.post("/predict", response_model=PredictionResponse)
def predict(payload: PredictionRequest, request: Request) -> PredictionResponse:
    model = request.app.state.model
    if model is None:
        detail = request.app.state.model_error or "The model is not loaded."
        raise HTTPException(status_code=503, detail=detail)

    try:
        input_frame = make_input_frame(payload)
        prediction_value = int(scalarize(model.predict(input_frame)))
        probability: float | None = None

        if hasattr(model, "predict_proba"):
            probabilities = np.asarray(model.predict_proba(input_frame))
            if probabilities.ndim == 2 and probabilities.shape[1] >= 2:
                probability = float(probabilities[0, 1])
            elif probabilities.size == 1:
                probability = float(probabilities.reshape(-1)[0])

        return PredictionResponse(
            prediction=prediction_value,
            label="Failure Risk" if prediction_value == 1 else "No Failure Detected",
            failure_probability=probability,
        )
    except (KeyError, ValueError, TypeError) as error:
        raise HTTPException(status_code=422, detail=f"Input does not match the model features: {error}") from error
    except Exception as error:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {error}") from error
