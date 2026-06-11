from datetime import datetime, timezone
from bson import ObjectId


def user_to_response(user: dict) -> dict:
    return {
        "id": str(user["_id"]),
        "name": user["name"],
        "email": user["email"],
        "role": user.get("role", "user"),
        "created_at": user["created_at"],
        "updated_at": user["updated_at"],
    }


def new_user_document(name: str, email: str, password_hash: str) -> dict:
    now = datetime.now(timezone.utc)
    return {
        "_id": ObjectId(),
        "name": name,
        "email": email.lower(),
        "password_hash": password_hash,
        "role": "user",
        "created_at": now,
        "updated_at": now,
    }

