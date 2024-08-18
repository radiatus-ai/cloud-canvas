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

    async def get_packages_by_project(
        self, db: AsyncSession, *, project_id: UUID, skip: int = 0, limit: int = 100
    ) -> List[Package]:
        query = (
            select(Package)
            .where(Package.project_id == project_id)
            .offset(skip)
            .limit(limit)
        )
        result = await db.execute(query)
        return result.scalars().all()

    async def create_package(
        self, db: AsyncSession, *, obj_in: PackageCreate, project_id: UUID
    ) -> Package:
        db_obj = Package(**obj_in.dict(), project_id=project_id)
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

    async def deploy_package(
        self, db: AsyncSession, *, project_id: UUID, package_id: UUID, deploy_data: dict
    ) -> Package:
        package = await self.get(db, id=package_id)
        if not package or package.project_id != project_id:
            return None

        # Update package with deploy data and set status to DEPLOYING
        for key, value in deploy_data.items():
            setattr(package, key, value)
        package.deploy_status = "DEPLOYING"

        await db.commit()
        await db.refresh(package)

        # Here you would typically trigger your actual deployment process
        # For now, we'll just set it to DEPLOYED
        package.deploy_status = "DEPLOYED"
        await db.commit()
        await db.refresh(package)

        return package

    async def destroy_package(
        self, db: AsyncSession, *, project_id: UUID, package_id: UUID
    ) -> Package:
        package = await self.get(db, id=package_id)
        if not package or package.project_id != project_id:
            return None

        # Here you would typically trigger your actual destroy process
        # For now, we'll just set the status to NOT_DEPLOYED
        package.deploy_status = "NOT_DEPLOYED"
        await db.commit()
        await db.refresh(package)

        return package

    async def delete_package(self, db: AsyncSession, *, id: UUID) -> Package:
        package = await self.get(db, id=id)
        if package:
            await db.delete(package)
            await db.commit()
        return package


package = CRUDPackage(Package)
