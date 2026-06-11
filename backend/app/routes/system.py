from fastapi import APIRouter
from app.services.model_service import get_model_service


router = APIRouter(tags=["System"])


@router.get("/")
async def root():
    return {"name": "Concrete Strength Inverse Predictor API", "status": "online"}


@router.get("/health")
async def health():
    return {"status": "healthy"}


@router.get("/api/model-info")
async def model_info():
    return get_model_service().model_info

