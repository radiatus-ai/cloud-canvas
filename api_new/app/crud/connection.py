from typing import List

from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.crud.base import CRUDBase
from app.models.connection import Connection
from app.schemas.connection import ConnectionCreate, ConnectionUpdate


class CRUDConnection(CRUDBase[Connection, ConnectionCreate, ConnectionUpdate]):
    async def get_connections_by_project(
        self, db: AsyncSession, *, project_id: UUID, skip: int = 0, limit: int = 100
    ) -> List[Connection]:
        query = (
            select(Connection)
            .where(Connection.project_id == project_id)
            .offset(skip)
            .limit(limit)
        )
        result = await db.execute(query)
        return result.scalars().all()


connection = CRUDConnection(Connection)
