# app/crud/chat.py

from typing import List

from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.core.logger import get_logger
from app.crud.base import CRUDBase
from app.models.chat import Chat

# from app.models.user import User, UserOrganization
from app.schemas.chat import ChatCreate, ChatUpdate

logger = get_logger(__name__)


class CRUDChat(CRUDBase[Chat, ChatCreate, ChatUpdate]):
    async def create_chat(
        self,
        db: AsyncSession,
        *,
        obj_in: ChatCreate,
        project_id: UUID,
        auto_commit=True,
    ) -> Chat:
        db_obj = Chat(name=obj_in.name, model=obj_in.model, project_id=project_id)
        # db.add(db_obj)
        # await db.flush()
        # await db.refresh(db_obj)
        db.add(db_obj)
        await db.flush()
        await db.refresh(db_obj)
        logger.info("DB CREAT\n" * 20)
        if auto_commit:
            await db.commit()
        # await db.commit()
        return db_obj

    async def get_chat(self, db: AsyncSession, *, chat_id: UUID):
        logger.info(f"Attempting to retrieve chat with ID: {chat_id}")
        logger.info(f"Type of chat_id: {type(chat_id)}")

        if isinstance(chat_id, str):
            try:
                chat_id = UUID(chat_id)
                logger.info(f"Converted chat_id to UUID: {chat_id}")
            except ValueError:
                logger.error(f"Invalid UUID string for chat_id: {chat_id}")
                return None

        try:
            chat = await super().get(db, id=chat_id)
            if chat:
                logger.info(f"Retrieved chat: {chat}")
                logger.info(f"Chat ID: {chat.id}, Type: {type(chat.id)}")
            else:
                logger.warning(f"No chat found with ID: {chat_id}")
            return chat
        except Exception as e:
            logger.error(f"Error retrieving chat: {str(e)}")
            raise

    async def get_chats_for_project(
        self, db: AsyncSession, *, project_id: UUID, skip: int = 0, limit: int = 100
    ) -> List[Chat]:
        query = (
            select(Chat).filter(Chat.project_id == project_id).offset(skip).limit(limit)
        )
        result = await db.execute(query)
        return result.scalars().all()

    # async def get_chats_for_user(
    #     self, db: AsyncSession, *, user: User, skip: int = 0, limit: int = 100
    # ) -> List[Chat]:
    #     query = (
    #         select(Chat)
    #         .join(Project, Chat.project_id == Project.id)
    #         .join(
    #             UserOrganization,
    #             Project.organization_id == UserOrganization.organization_id,
    #         )
    #         .where(UserOrganization.user_id == user.id)
    #         .offset(skip)
    #         .limit(limit)
    #     )
    #     result = await db.execute(query)
    #     return result.scalars().all()

    async def update_chat(
        self, db: AsyncSession, *, db_obj: Chat, obj_in: ChatUpdate
    ) -> Chat:
        return await super().update(db, db_obj=db_obj, obj_in=obj_in)

    async def delete_chat(self, db: AsyncSession, *, id: UUID) -> Chat:
        return await super().remove(db, id=id)


chat = CRUDChat(Chat)
