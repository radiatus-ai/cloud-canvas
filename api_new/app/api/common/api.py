from fastapi import APIRouter

from app.api.common.endpoints import auth as auth_router
from app.api.common.endpoints import me as me_router
from app.api.common.endpoints import tokens as token_router

api_router = APIRouter()
api_router.include_router(auth_router.router)
api_router.include_router(me_router.router)
api_router.include_router(token_router.router)
