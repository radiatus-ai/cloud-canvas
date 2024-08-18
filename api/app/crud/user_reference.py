from typing import Optional

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.crud.base import CRUDBase
from app.models.user_reference import UserReference
from app.schemas.user import UserCreate, UserUpdate


class CRUDUser(CRUDBase[UserReference, UserCreate, UserUpdate]):
    async def get_by_email(
        self, db: AsyncSession, *, email: str
    ) -> Optional[UserReference]:
        statement = select(self.model).where(self.model.email == email)
        result = await db.execute(statement)
        return result.scalar_one_or_none()

    async def get_by_google_id(
        self, db: AsyncSession, *, google_id: str
    ) -> Optional[UserReference]:
        statement = select(self.model).where(self.model.google_id == google_id)
        result = await db.execute(statement)
        return result.scalar_one_or_none()


user = CRUDUser(UserReference)
