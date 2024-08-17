# app/crud/chat_message.py
from typing import List

from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.core.logger import get_logger
from app.crud.base import CRUDBase
from app.models.chat_message import ChatMessage
from app.schemas.chat_message import ChatMessageCreate, ChatMessageUpdate

logger = get_logger(__name__)


class CRUDChatMessage(CRUDBase[ChatMessage, ChatMessageCreate, ChatMessageUpdate]):
    async def create_message(
        self,
        db: AsyncSession,
        *,
        obj_in: ChatMessageCreate,
        chat_id: UUID,
        auto_commit=True,
    ) -> ChatMessage:
        logger.info("chat message\n" * 20)
        logger.info(obj_in)
        db_obj = ChatMessage(
            role=obj_in.role,
            content=obj_in.content,
            is_context_file=obj_in.is_context_file,
            model=obj_in.model,
            tokens=obj_in.tokens,
            content_raw=obj_in.content_raw,
            is_tool_message=obj_in.is_tool_message,
            chat_id=chat_id,
        )
        db.add(db_obj)
        await db.flush()
        await db.refresh(db_obj)
        # this actually causes problems, these should prob default false
        if auto_commit:
            await db.commit()
        logger.info("DB DONE\n" * 20)
        return db_obj

    async def get_messages_for_chat(
        self, db: AsyncSession, *, chat_id: UUID, skip: int = 0, limit: int = 100
    ) -> List[ChatMessage]:
        query = (
            select(ChatMessage)
            .filter(ChatMessage.chat_id == chat_id)
            .offset(skip)
            .limit(limit)
        )
        result = await db.execute(query)
        return result.scalars().all()

    async def update_message(
        self, db: AsyncSession, *, db_obj: ChatMessage, obj_in: ChatMessageUpdate
    ) -> ChatMessage:
        return await super().update(db, db_obj=db_obj, obj_in=obj_in)

    async def delete_message(self, db: AsyncSession, *, id: UUID) -> ChatMessage:
        return await super().remove(db, id=id)


chat_message = CRUDChatMessage(ChatMessage)
