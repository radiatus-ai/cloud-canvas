from typing import List, Optional

from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.crud.base import CRUDBase
from app.models.package import Package
from app.schemas.package import PackageCreate, PackageUpdate


class CRUDPackage(CRUDBase[Package, PackageCreate, PackageUpdate]):
    async def get_packages(
        self, db: AsyncSession, *, skip: int = 0, limit: int = 100
    ) -> List[Package]:
        query = select(Package).offset(skip).limit(limit)
        result = await db.execute(query)
        return result.scalars().all()

    async def create_package(
        self, db: AsyncSession, *, obj_in: PackageCreate
    ) -> Package:
        db_obj = Package(**obj_in.dict())
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def get_package(self, db: AsyncSession, *, id: UUID) -> Optional[Package]:
        query = select(Package).where(Package.id == id)
        result = await db.execute(query)
        return result.scalars().first()

    async def update_package(
        self, db: AsyncSession, *, db_obj: Package, obj_in: PackageUpdate
    ) -> Package:
        update_data = obj_in.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_obj, field, value)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def delete_package(self, db: AsyncSession, *, id: UUID) -> Package:
        package = await self.get(db, id=id)
        if package:
            await db.delete(package)
            await db.commit()
        return package


package = CRUDPackage(Package)
