from fastapi import APIRouter, Depends
from app.database.database import get_database
from app.routes.dependencies import get_current_user
from app.schemas.prediction import PredictionRequest, PredictionResponse
from app.services.history_service import HistoryService
from app.services.model_service import get_model_service


router = APIRouter(prefix="/api", tags=["Prediction"])


@router.post("/predict", response_model=PredictionResponse)
async def predict(payload: PredictionRequest, current_user: dict = Depends(get_current_user)):
    prediction = get_model_service().predict(payload.strength)
    history = await HistoryService(get_database()).save_prediction(str(current_user["_id"]), payload.strength, prediction)
    return {"id": history["id"], "strength_input": payload.strength, "created_at": history["created_at"], **prediction}

