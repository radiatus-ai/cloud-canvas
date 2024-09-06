from typing import List, Optional

from sqlalchemy import or_
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

    async def delete_connections_for_package(
        self, db: AsyncSession, *, package_id: UUID
    ) -> List[Connection]:
        query = select(Connection).where(
            or_(
                Connection.source_package_id == package_id,
                Connection.target_package_id == package_id,
            )
        )
        result = await db.execute(query)
        connections = result.scalars().all()
        for connection in connections:
            await db.delete(connection)
        await db.commit()
        return connections

    async def delete_connection_by_source_and_target(
        self, db: AsyncSession, *, source_package_id: UUID, target_package_id: UUID
    ) -> Connection:
        query = select(Connection).where(
            or_(
                Connection.source_package_id == source_package_id,
                Connection.target_package_id == target_package_id,
            )
        )
        result = await db.execute(query)
        connection = result.scalars().first()
        if connection:
            await db.delete(connection)
            await db.commit()
        return connection

    async def delete_connections_by_target(
        self, db: AsyncSession, *, target_package_id: UUID
    ) -> List[Connection]:
        query = select(Connection).where(
            Connection.target_package_id == target_package_id
        )
        result = await db.execute(query)
        connections = result.scalars().all()
        for connection in connections:
            await db.delete(connection)
        await db.commit()
        return connections


connection = CRUDConnection(Connection)
