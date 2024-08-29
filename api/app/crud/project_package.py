import json
from typing import List, Optional

from core.pubsub import PubSubMessenger
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.core.logger import get_logger
from app.crud.base import CRUDBase
from app.crud.connection import connection as crud_connection
from app.crud.project import project as crud_project
from app.models.project_package import ProjectPackage
from app.schemas.project_package import ProjectPackageCreate, ProjectPackageUpdate
from app.schemas.provisioner_project_package import (
    ProjectPackageUpdate as ProvisionerProjectPackageUpdate,
)

logger = get_logger(__name__)


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

    async def provisioner_update_package(
        self,
        db: AsyncSession,
        *,
        db_obj: ProjectPackage,
        obj_in: ProvisionerProjectPackageUpdate,
    ) -> ProjectPackage:
        update_data = obj_in.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_obj, field, value)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def deploy_package(
        self, db: AsyncSession, *, project_id: UUID, package_id: UUID
    ) -> Optional[ProjectPackage]:
        package = await self.get_package(db, id=package_id, project_id=project_id)
        if not package:
            return None

        package.deploy_status = "DEPLOYING"
        await db.commit()
        await db.refresh(package)

        project = await crud_project.get(db, id=project_id)
        await db.refresh(project)

        logger.info(f"Project credentials: {project.credentials}")

        credentials = {}
        if project and project.credentials:
            for credential in project.credentials:
                credentials[credential.name] = credential.credential_value

        # Fetch connections for this package
        connections = await crud_connection.get_connections_by_project(
            db, project_id=project_id
        )
        connected_input_data = {}
        for connection in connections:
            if connection.target_package_id == package_id:
                connected_input_data[str(connection.source_handle)] = {
                    "id": "https://www.googleapis.com/compute/v1/projects/rad-dev-dogfood-n437/global/networks/nexxxttt",
                }

        deployment_message = {
            "project_id": str(project_id),
            "package_id": str(package_id),
            "package": {
                "type": package.type,
                "parameter_data": package.parameter_data,
                "outputs": package.outputs or {},
            },
            "action": "DEPLOY",
            "secrets": credentials,
            "connected_input_data": connected_input_data,
        }

        publisher = PubSubMessenger()
        result = publisher.publish_message(json.dumps(deployment_message))

        if result.startswith("error"):
            logger.error(f"Failed to publish deployment message: {result}")
            package.deploy_status = "FAILED"
            await db.commit()
            await db.refresh(package)
        else:
            logger.info(f"Successfully published deployment message: {result}")

        return package

    async def destroy_package(
        self, db: AsyncSession, *, project_id: UUID, package_id: UUID
    ) -> Optional[ProjectPackage]:
        package = await self.get_package(db, id=package_id, project_id=project_id)
        if not package:
            return None

        project = await crud_project.get(db, id=project_id)
        await db.refresh(project)

        credentials = {}
        if project and project.credentials:
            for credential in project.credentials:
                credentials[credential.name] = credential.credential_value

        # Fetch connections for this package
        connections = await crud_connection.get_connections_by_project(
            db, project_id=project_id
        )
        connected_input_data = {}
        for connection in connections:
            if connection.target_package_id == package_id:
                # todo handle
                connected_input_data[str(connection.source_handle)] = {
                    # "id": "id-of-network",
                    "id": "https://www.googleapis.com/compute/v1/projects/rad-dev-dogfood-n437/global/networks/nexxxttt",
                }

        deployment_message = {
            "project_id": str(project_id),
            "package_id": str(package_id),
            "package": {
                "type": package.type,
                "parameter_data": package.parameter_data,
                "outputs": package.outputs or {},
            },
            "action": "DESTROY",
            "secrets": credentials,
            "connected_input_data": connected_input_data,
        }

        publisher = PubSubMessenger()
        result = publisher.publish_message(json.dumps(deployment_message))

        if result.startswith("error"):
            logger.error(f"Failed to publish deployment message: {result}")
            package.deploy_status = "FAILED"
            await db.commit()
            await db.refresh(package)
        else:
            logger.info(f"Successfully published deployment message: {result}")

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
