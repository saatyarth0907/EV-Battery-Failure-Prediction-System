# ⚡ EV Battery Failure Prediction System

::: {align="center"}
### Machine Learning--Powered EV Battery Diagnostics

**Real-time battery failure risk prediction through a modern full-stack
ML application.**

![Python](https://img.shields.io/badge/Python-3.9%2B-blue?logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-API-009688?logo=fastapi&logoColor=white)
![scikit-learn](https://img.shields.io/badge/scikit--learn-ML-F7931E?logo=scikitlearn&logoColor=white)
![React](https://img.shields.io/badge/React-TypeScript-61DAFB?logo=react&logoColor=black)
![Tailwind
CSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?logo=tailwindcss&logoColor=white)
:::

------------------------------------------------------------------------

## 📌 Overview

**EV Battery Failure Prediction System** is a full-stack
machine-learning application that serves a trained **Linear Discriminant
Analysis (LDA)** model for EV battery diagnostics.

The React frontend collects seven battery and vehicle parameters and
sends them to a FastAPI backend. FastAPI loads the saved Joblib artifact
once at startup, performs inference, and returns the prediction and
model probability when available.

### ✨ Key Features

-   ⚡ Real-time **Failure / No Failure** prediction
-   🧠 Saved **scikit-learn LDA** model served with Joblib
-   🔌 FastAPI REST inference endpoint
-   💻 React + TypeScript diagnostic dashboard
-   📊 Failure-probability visualization
-   📈 Evaluation metrics and confusion matrix
-   🛡️ No fake browser-side predictions or model retraining

------------------------------------------------------------------------

## 🧠 Model Inputs

  Feature                    Description
  -------------------------- -----------------------------------------
  `battery_health_percent`   Current battery health percentage
  `capacity_loss_percent`    Battery capacity degradation
  `internal_resistance`      Internal battery resistance
  `cycle_count`              Charge/discharge cycle count
  `vehicle_age_years`        Vehicle age
  `cell_temperature_max`     Maximum cell temperature
  `BMS_warning_count`        Battery Management System warning count

> **Important:** Feature names and ordering must match the features
> expected by the trained model artifact.

------------------------------------------------------------------------

## 🏗️ Architecture

``` text
┌──────────────────────────────────┐
│ React + TypeScript + Tailwind    │
│          + Recharts              │
└────────────────┬─────────────────┘
                 │ POST /predict
                 ▼
┌──────────────────────────────────┐
│             FastAPI              │
│ Validation → Pandas DataFrame    │
└────────────────┬─────────────────┘
                 ▼
┌──────────────────────────────────┐
│       Saved Joblib Model         │
│ Linear Discriminant Analysis     │
└────────────────┬─────────────────┘
                 ▼
       Prediction + Probability
                 │
                 ▼
         React Diagnostic UI
```

------------------------------------------------------------------------

## 📊 Model Evaluation

Evaluation values displayed by the dashboard for the supplied LDA
experiment:

  Metric                 Score
  --------------- ------------
  **Accuracy**      **97.07%**
  **Precision**     **84.85%**
  **Recall**        **59.57%**
  **F1 Score**      **70.00%**
  **ROC-AUC**       **98.23%**

### Confusion Matrix

                             Predicted: No Failure   Predicted: Failure
  ------------------------ ----------------------- --------------------
  **Actual: No Failure**             **1534 (TN)**          **10 (FP)**
  **Actual: Failure**                  **38 (FN)**          **56 (TP)**

> Evaluation metrics are presentation metrics from the evaluated model.
> Live predictions always come from the saved model.

------------------------------------------------------------------------

## 🛠️ Tech Stack

**Machine Learning & Backend:** Python · Scikit-learn · Pandas · NumPy ·
Joblib · FastAPI

**Frontend:** React · TypeScript · Tailwind CSS · Recharts

------------------------------------------------------------------------

## 📁 Model Artifact

Place the trained model at:

``` text
backend/model/battery_failure_model.pkl
```

If the artifact is a complete scikit-learn Pipeline, FastAPI can pass
the raw DataFrame directly to:

``` python
model.predict(input_df)
model.predict_proba(input_df)
```

If `predict_proba()` is unavailable, `failure_probability` is returned
as `null`.

------------------------------------------------------------------------

## 🚀 Quick Start

### Backend

Requires **Python 3.9+**.

``` bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Frontend

``` bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

The Vite development server normally runs at:

``` text
http://localhost:5173
```

------------------------------------------------------------------------

## ⚙️ Environment

Configure the API origin in `frontend/.env`:

``` env
VITE_API_URL=http://localhost:8000
```

------------------------------------------------------------------------

## 🔧 Model Configuration

Edit `backend/config.py`:

``` python
MODEL_PATH = BASE_DIR / "model" / "battery_failure_model.pkl"
MODEL_NAME = "Linear Discriminant Analysis"

FEATURE_NAMES = [
    "battery_health_percent",
    "capacity_loss_percent",
    "internal_resistance",
    "cycle_count",
    "vehicle_age_years",
    "cell_temperature_max",
    "BMS_warning_count",
]
```

------------------------------------------------------------------------

## 🔌 API Reference

### Health Check

``` http
GET /health
```

If the model cannot be loaded, the API reports `model_loaded: false`.

### Predict

``` http
POST /predict
```

Example request:

``` json
{
  "battery_health_percent": 72,
  "capacity_loss_percent": 25,
  "internal_resistance": 0.15,
  "cycle_count": 950,
  "vehicle_age_years": 6,
  "cell_temperature_max": 48,
  "BMS_warning_count": 1
}
```

Example response:

``` json
{
  "prediction": 1,
  "label": "Failure Risk",
  "failure_probability": 0.82
}
```

------------------------------------------------------------------------

## 🔄 Prediction Flow

``` text
Battery parameters
       ↓
React form
       ↓
POST /predict
       ↓
FastAPI validation
       ↓
Pandas DataFrame
       ↓
Saved Joblib model
       ↓
Prediction + probability
       ↓
Diagnostic dashboard
```

------------------------------------------------------------------------

## 🎯 Purpose

This project demonstrates the deployment path of a trained
machine-learning model:

**ML Model → Serialization → REST API → Frontend Integration → Real-Time
Inference**

The application focuses on inference and deployment. It does not retrain
the model and does not generate predictions using frontend rules.

------------------------------------------------------------------------

## ⚠️ Notes

-   Input features must match the trained artifact.
-   Live predictions come exclusively from the saved Python model.
-   Evaluation metrics shown in the UI are separate from live inference.
-   If the model file is missing or fails to load, the backend returns
    an explicit error rather than fabricating a result.

------------------------------------------------------------------------

::: {align="center"}
### ⚡ EV Battery Failure Prediction System

**Scikit-learn × FastAPI × React**
:::
