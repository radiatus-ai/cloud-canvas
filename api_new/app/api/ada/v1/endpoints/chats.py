# app/api/v1/endpoints/chat.py

from typing import List

from fastapi import APIRouter, Depends, HTTPException
from pydantic import UUID4

from app.core.dependencies import get_db_and_current_user
from app.core.logger import get_logger
from app.crud.chat import chat as crud_chat
from app.crud.chat_message import chat_message as crud_chat_message
from app.crud.project import project as crud_project
from app.schemas.chat import Chat, ChatUpdate
from app.schemas.chat_message import ChatMessage, ChatMessageCreate

logger = get_logger(__name__)

router = APIRouter(
    prefix="/chats",
    tags=["chats"],
)


@router.get("/{chat_id}", response_model=Chat)
async def read_chat(
    chat_id: UUID4,
    deps: dict = Depends(get_db_and_current_user),
):
    db = deps["db"]
    current_user = deps["current_user"]
    chat = await crud_chat.get(db, id=chat_id)
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    # project = await crud_project.get(db, id=chat.project_id)
    # if project.organization_id != current_user.organization_id:
    #     raise HTTPException(status_code=403, detail="Not enough permissions")
    return chat


@router.put("/{chat_id}", response_model=Chat)
async def update_chat(
    chat_id: UUID4,
    chat_in: ChatUpdate,
    deps: dict = Depends(get_db_and_current_user),
):
    db = deps["db"]
    current_user = deps["current_user"]
    chat = await crud_chat.get(db, id=chat_id)
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    # project = await crud_project.get(db, id=chat.project_id)
    # if project.organization_id != current_user.organization_id:
    #     raise HTTPException(status_code=403, detail="Not enough permissions")
    chat = await crud_chat.update(db, db_obj=chat, obj_in=chat_in)
    return chat


@router.delete("/{chat_id}", response_model=Chat)
async def delete_chat(
    chat_id: UUID4,
    deps: dict = Depends(get_db_and_current_user),
):
    db = deps["db"]
    current_user = deps["current_user"]
    chat = await crud_chat.get(db, id=chat_id)
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    # project = await crud_project.get(db, id=chat.project_id)
    # if project.organization_id != current_user.organization_id:
    #     raise HTTPException(status_code=403, detail="Not enough permissions")
    chat = await crud_chat.delete_chat(db, id=chat_id)
    return chat


@router.post("/{chat_id}/messages", response_model=ChatMessage)
async def create_chat_message(
    chat_id: UUID4,
    message_in: ChatMessageCreate,
    deps: dict = Depends(get_db_and_current_user),
):
    db = deps["db"]
    current_user = deps["current_user"]
    chat = await crud_chat.get(db, id=chat_id)
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    project = await crud_project.get(db, id=chat.project_id)
    # if project.organization_id != current_user.organization_id:
    #     raise HTTPException(status_code=403, detail="Not enough permissions")
    message = await crud_chat_message.create_message(
        db, obj_in=message_in, chat_id=chat_id
    )
    return message


@router.get("/{chat_id}/messages", response_model=List[ChatMessage])
async def read_chat_messages(
    chat_id: UUID4,
    skip: int = 0,
    limit: int = 100,
    deps: dict = Depends(get_db_and_current_user),
):
    db = deps["db"]
    current_user = deps["current_user"]
    chat = await crud_chat.get_chat(db, chat_id=chat_id)
    logger.info("CHAT RESPONSE")
    logger.info(f"chat {chat}")
    logger.info(f"chat_id {chat_id}")
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    # project = await crud_project.get(db, id=chat.project_id)
    # if project.organization_id != current_user.organization_id:
    #     raise HTTPException(status_code=403, detail="Not enough permissions")
    messages = await crud_chat_message.get_messages_for_chat(
        db, chat_id=chat_id, skip=skip, limit=limit
    )
    return messages
