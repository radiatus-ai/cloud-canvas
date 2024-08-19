from typing import List, Optional

from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.crud.base import CRUDBase
from app.models.project_package import ProjectPackage
from app.schemas.project_package import ProjectPackageCreate, ProjectPackageUpdate


class CRUDProjectPackage(
    CRUDBase[ProjectPackage, ProjectPackageCreate, ProjectPackageUpdate]
):
    async def get_packages_by_project(
        self, db: AsyncSession, *, project_id: UUID, skip: int = 0, limit: int = 100
    ) -> List[ProjectPackage]:
        query = (
            select(ProjectPackage)
            .where(ProjectPackage.project_id == project_id)
            .offset(skip)
            .limit(limit)
        )
        result = await db.execute(query)
        return result.scalars().all()

    async def create_project_package(
        self, db: AsyncSession, *, obj_in: ProjectPackageCreate, project_id: UUID
    ) -> ProjectPackage:
        db_obj = ProjectPackage(**obj_in.dict(), project_id=project_id)
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def get_package(
        self, db: AsyncSession, *, id: UUID, project_id: UUID
    ) -> Optional[ProjectPackage]:
        query = select(ProjectPackage).where(
            ProjectPackage.id == id, ProjectPackage.project_id == project_id
        )
        result = await db.execute(query)
        return result.scalars().first()

    async def update_package(
        self, db: AsyncSession, *, db_obj: ProjectPackage, obj_in: ProjectPackageUpdate
    ) -> ProjectPackage:
        update_data = obj_in.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_obj, field, value)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def deploy_package(
        self, db: AsyncSession, *, project_id: UUID, package_id: UUID, deploy_data: dict
    ) -> Optional[ProjectPackage]:
        package = await self.get_package(db, id=package_id, project_id=project_id)
        if not package:
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
    ) -> Optional[ProjectPackage]:
        package = await self.get_package(db, id=package_id, project_id=project_id)
        if not package:
            return None

        # Here you would typically trigger your actual destroy process
        # For now, we'll just set the status to NOT_DEPLOYED
        package.deploy_status = "NOT_DEPLOYED"
        await db.commit()
        await db.refresh(package)

        return package

    async def delete_package(
        self, db: AsyncSession, *, id: UUID, project_id: UUID
    ) -> Optional[ProjectPackage]:
        package = await self.get_package(db, id=id, project_id=project_id)
        if package:
            await db.delete(package)
            await db.commit()
        return package


project_package = CRUDProjectPackage(ProjectPackage)
