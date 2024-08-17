# app/crud/api_token.py
import secrets
from typing import List

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.crud.base import CRUDBase
from app.models.api_token import APIToken
from app.schemas.api_token import APITokenCreate


class CRUDAPIToken(CRUDBase[APIToken, APITokenCreate, APITokenCreate]):
    async def create_token(
        self, db: AsyncSession, *, obj_in: APITokenCreate, user_id: int
    ) -> APIToken:
        token = secrets.token_urlsafe(32)
        db_obj = APIToken(token=token, name=obj_in.name, user_id=user_id)
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def get_tokens_for_user(
        self, db: AsyncSession, user_id: int
    ) -> List[APIToken]:
        result = await db.execute(select(APIToken).where(APIToken.user_id == user_id))
        return result.scalars().all()

    async def delete_token(
        self, db: AsyncSession, *, token_id: int, user_id: int
    ) -> APIToken:
        result = await db.execute(
            select(APIToken).where(APIToken.id == token_id, APIToken.user_id == user_id)
        )
        token = result.scalar_one_or_none()
        if token:
            await db.delete(token)
            await db.commit()
        return token


api_token = CRUDAPIToken(APIToken)
