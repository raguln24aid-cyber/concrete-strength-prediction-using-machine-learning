import json
import logging
from functools import lru_cache
from pathlib import Path
import joblib
import numpy as np
import pandas as pd
from app.config.settings import get_settings


logger = logging.getLogger(__name__)
OUTPUT_COLUMNS = [
    "Cement",
    "Blast Furnace Slag",
    "Fly Ash",
    "Water",
    "Superplasticizer",
    "Coarse Aggregate",
    "Fine Aggregate",
]


class ModelService:
    def __init__(self, model_dir: Path):
        self.model_dir = model_dir
        self.model = joblib.load(model_dir / "best_model.pkl")
        self.scaler = joblib.load(model_dir / "scaler.pkl")
        info_path = model_dir / "model_info.json"
        self.model_info = json.loads(info_path.read_text(encoding="utf-8")) if info_path.exists() else {}

    def predict(self, strength: float) -> dict:
        x = pd.DataFrame({"Strength": [strength]})
        x_scaled = self.scaler.transform(x)
        prediction = np.asarray(self.model.predict(x_scaled))[0]
        prediction = np.maximum(prediction, 0)
        return {
            "cement": round(float(prediction[0]), 3),
            "blast_furnace_slag": round(float(prediction[1]), 3),
            "fly_ash": round(float(prediction[2]), 3),
            "water": round(float(prediction[3]), 3),
            "superplasticizer": round(float(prediction[4]), 3),
            "coarse_aggregate": round(float(prediction[5]), 3),
            "fine_aggregate": round(float(prediction[6]), 3),
        }


@lru_cache
def get_model_service() -> ModelService:
    return ModelService(get_settings().model_dir)
