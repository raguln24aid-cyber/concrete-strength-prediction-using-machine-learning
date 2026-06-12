from datetime import datetime
from pydantic import BaseModel, Field


class PredictionRequest(BaseModel):
    strength: float = Field(gt=0, le=150)


class PredictionOutput(BaseModel):
    cement: float
    blast_furnace_slag: float
    fly_ash: float
    water: float
    superplasticizer: float
    coarse_aggregate: float
    fine_aggregate: float


class PredictionResponse(PredictionOutput):
    id: str | None = None
    strength_input: float
    created_at: datetime | None = None


class HistoryResponse(BaseModel):
    id: str
    user_id: str
    strength_input: float
    predicted_cement: float
    predicted_blast_furnace_slag: float
    predicted_fly_ash: float
    predicted_water: float
    predicted_superplasticizer: float
    predicted_coarse_aggregate: float
    predicted_fine_aggregate: float
    created_at: datetime

