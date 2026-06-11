from datetime import datetime, timezone
from bson import ObjectId
from fastapi import HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.models.history import history_to_response


class HistoryService:
    def __init__(self, database: AsyncIOMotorDatabase):
        self.db = database

    async def save_prediction(self, user_id: str, strength: float, prediction: dict) -> dict:
        doc = {
            "_id": ObjectId(),
            "user_id": ObjectId(user_id),
            "strength_input": strength,
            "predicted_cement": prediction["cement"],
            "predicted_blast_furnace_slag": prediction["blast_furnace_slag"],
            "predicted_fly_ash": prediction["fly_ash"],
            "predicted_water": prediction["water"],
            "predicted_superplasticizer": prediction["superplasticizer"],
            "predicted_coarse_aggregate": prediction["coarse_aggregate"],
            "predicted_fine_aggregate": prediction["fine_aggregate"],
            "predicted_age": prediction["age"],
            "created_at": datetime.now(timezone.utc),
        }
        await self.db.prediction_history.insert_one(doc)
        return history_to_response(doc)

    async def list_history(self, user_id: str, search: str | None = None, skip: int = 0, limit: int = 50) -> list[dict]:
        query: dict = {"user_id": ObjectId(user_id)}
        if search:
            try:
                value = float(search)
                query["strength_input"] = value
            except ValueError:
                pass
        cursor = self.db.prediction_history.find(query).sort("created_at", -1).skip(skip).limit(limit)
        return [history_to_response(item) async for item in cursor]

    async def get_history(self, user_id: str, history_id: str) -> dict:
        item = await self.db.prediction_history.find_one({"_id": ObjectId(history_id), "user_id": ObjectId(user_id)})
        if not item:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Prediction history not found")
        return history_to_response(item)

    async def delete_history(self, user_id: str, history_id: str) -> dict:
        result = await self.db.prediction_history.delete_one({"_id": ObjectId(history_id), "user_id": ObjectId(user_id)})
        if result.deleted_count == 0:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Prediction history not found")
        return {"deleted": True}

    async def clear_history(self, user_id: str) -> dict:
        result = await self.db.prediction_history.delete_many({"user_id": ObjectId(user_id)})
        return {"deleted_count": result.deleted_count}

