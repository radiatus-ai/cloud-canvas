from typing import List

from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.crud.base import CRUDBase
from app.models.package import Package
from app.schemas.package import PackageCreate, PackageUpdate


class CRUDPackage(CRUDBase[Package, PackageCreate, PackageUpdate]):
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


package = CRUDPackage(Package)
