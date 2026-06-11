from contextlib import asynccontextmanager
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config.settings import get_settings
from app.database.database import close_mongo_connection, connect_to_mongo
from app.middleware.rate_limit import RateLimitMiddleware
from app.middleware.request_logging import RequestLoggingMiddleware
from app.routes import auth, history, prediction, system
from app.utils.logging import configure_logging


configure_logging()
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_to_mongo()
    logger.info("MongoDB connected")
    yield
    await close_mongo_connection()
    logger.info("MongoDB disconnected")


settings = get_settings()
app = FastAPI(
    title=settings.app_name,
    version="1.0.0",
    description="Production API for inverse concrete mix prediction from target compressive strength.",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(RateLimitMiddleware)
app.add_middleware(RequestLoggingMiddleware)

app.include_router(system.router)
app.include_router(auth.router)
app.include_router(prediction.router)
app.include_router(history.router)

