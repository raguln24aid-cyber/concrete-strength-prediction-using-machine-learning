from fastapi import APIRouter, Depends, Query
from app.database.database import get_database
from app.routes.dependencies import get_current_user
from app.schemas.prediction import HistoryResponse
from app.services.history_service import HistoryService


router = APIRouter(prefix="/api/history", tags=["History"])


@router.get("", response_model=list[HistoryResponse])
async def list_history(
    current_user: dict = Depends(get_current_user),
    search: str | None = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
):
    return await HistoryService(get_database()).list_history(str(current_user["_id"]), search, skip, limit)


@router.get("/{history_id}", response_model=HistoryResponse)
async def get_history(history_id: str, current_user: dict = Depends(get_current_user)):
    return await HistoryService(get_database()).get_history(str(current_user["_id"]), history_id)


@router.delete("/{history_id}")
async def delete_history(history_id: str, current_user: dict = Depends(get_current_user)):
    return await HistoryService(get_database()).delete_history(str(current_user["_id"]), history_id)


@router.delete("")
async def clear_history(current_user: dict = Depends(get_current_user)):
    return await HistoryService(get_database()).clear_history(str(current_user["_id"]))

