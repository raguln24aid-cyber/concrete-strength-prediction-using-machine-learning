from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from app.config.settings import get_settings


class MongoDB:
    client: AsyncIOMotorClient | None = None
    database: AsyncIOMotorDatabase | None = None


db = MongoDB()


async def connect_to_mongo() -> None:
    settings = get_settings()
    db.client = AsyncIOMotorClient(settings.mongodb_url)
    db.database = db.client[settings.database_name]
    await db.database.users.create_index("email", unique=True)
    await db.database.prediction_history.create_index([("user_id", 1), ("created_at", -1)])


async def close_mongo_connection() -> None:
    if db.client:
        db.client.close()


def get_database() -> AsyncIOMotorDatabase:
    if db.database is None:
        raise RuntimeError("Database connection is not initialized")
    return db.database

