from fastapi import HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.models.user import new_user_document, user_to_response
from app.utils.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    hash_password,
    verify_password,
)


class AuthService:
    def __init__(self, database: AsyncIOMotorDatabase):
        self.db = database

    async def register(self, name: str, email: str, password: str) -> dict:
        if await self.db.users.find_one({"email": email.lower()}):
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")
        user = new_user_document(name, email, hash_password(password))
        await self.db.users.insert_one(user)
        return self._tokens(user)

    async def login(self, email: str, password: str) -> dict:
        user = await self.db.users.find_one({"email": email.lower()})
        if not user or not verify_password(password, user["password_hash"]):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")
        return self._tokens(user)

    async def refresh(self, refresh_token: str) -> dict:
        user_id = decode_token(refresh_token, "refresh")
        user = await self.get_user_by_id(user_id)
        return self._tokens(user)

    async def get_user_by_id(self, user_id: str) -> dict:
        from bson import ObjectId

        user = await self.db.users.find_one({"_id": ObjectId(user_id)})
        if not user:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
        return user

    def _tokens(self, user: dict) -> dict:
        subject = str(user["_id"])
        return {
            "access_token": create_access_token(subject),
            "refresh_token": create_refresh_token(subject),
            "user": user_to_response(user),
        }

