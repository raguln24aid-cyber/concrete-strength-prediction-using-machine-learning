from fastapi import APIRouter, Depends
from app.database.database import get_database
from app.models.user import user_to_response
from app.routes.dependencies import get_current_user
from app.schemas.auth import LoginRequest, RefreshRequest, RegisterRequest, TokenResponse, UserResponse
from app.services.auth_service import AuthService


router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post("/register", response_model=TokenResponse, status_code=201)
async def register(payload: RegisterRequest):
    return await AuthService(get_database()).register(payload.name, payload.email, payload.password)


@router.post("/login", response_model=TokenResponse)
async def login(payload: LoginRequest):
    return await AuthService(get_database()).login(payload.email, payload.password)


@router.post("/refresh", response_model=TokenResponse)
async def refresh(payload: RefreshRequest):
    return await AuthService(get_database()).refresh(payload.refresh_token)


@router.get("/me", response_model=UserResponse)
async def me(current_user: dict = Depends(get_current_user)):
    return user_to_response(current_user)


@router.post("/logout")
async def logout():
    return {"message": "Logged out. Remove tokens on the client."}

