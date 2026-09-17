from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
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
