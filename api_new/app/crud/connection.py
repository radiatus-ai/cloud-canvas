from typing import List, Optional

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

    async def create_connection(
        self, db: AsyncSession, *, obj_in: ConnectionCreate, project_id: UUID
    ) -> Connection:
        db_obj = Connection(**obj_in.dict(), project_id=project_id)
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def get_connection(
        self, db: AsyncSession, *, id: UUID
    ) -> Optional[Connection]:
        query = select(Connection).where(Connection.id == id)
        result = await db.execute(query)
        return result.scalars().first()

    async def delete_connection(self, db: AsyncSession, *, id: UUID) -> Connection:
        connection = await self.get(db, id=id)
        if connection:
            await db.delete(connection)
            await db.commit()
        return connection


connection = CRUDConnection(Connection)
