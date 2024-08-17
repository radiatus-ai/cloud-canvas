from api.ada.v1.endpoints import chat_messages, chats, credentials, live, projects
from fastapi import APIRouter, Depends

from app.api.common.endpoints.tokens import get_db_and_current_user

api_router = APIRouter(dependencies=[Depends(get_db_and_current_user)])
api_router.include_router(credentials.router)
api_router.include_router(projects.router)
api_router.include_router(chats.router)
api_router.include_router(chat_messages.router)
api_router.include_router(live.router)
