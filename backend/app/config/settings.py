from functools import lru_cache
from pathlib import Path
from pydantic import AliasChoices, Field
from pydantic_settings import BaseSettings, SettingsConfigDict

PROJECT_ROOT = Path(__file__).resolve().parents[3]
DEFAULT_MODEL_DIR = PROJECT_ROOT / "models"


class Settings(BaseSettings):
    app_name: str = "Concrete Strength Inverse Predictor"
    environment: str = "development"
    mongodb_url: str = "mongodb://localhost:27017"
    database_name: str = Field(default="concrete_ai", validation_alias=AliasChoices("DATABASE_NAME", "DB_NAME"))
    secret_key: str = "change-this-secret-before-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    refresh_token_expire_days: int = 7
    frontend_url: str = "http://localhost:5173"
    backend_url: str = "http://localhost:8000"
    cors_origins: str = ""
    rate_limit_requests: int = 120
    rate_limit_window_seconds: int = 60
    model_dir: Path = Field(default=DEFAULT_MODEL_DIR, validation_alias=AliasChoices("MODEL_DIR"))

    model_config = SettingsConfigDict(
        env_file=PROJECT_ROOT / ".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    @property
    def allowed_origins(self) -> list[str]:
        origins = {
            self.frontend_url,
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            "http://localhost:5174",
            "http://127.0.0.1:5174",
        }
        if self.cors_origins:
            origins.update(origin.strip() for origin in self.cors_origins.split(",") if origin.strip())
        return sorted(origins)


@lru_cache
def get_settings() -> Settings:
    return Settings()
