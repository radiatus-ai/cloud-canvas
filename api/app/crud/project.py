from typing import List, Optional

from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.crud.base import CRUDBase
from app.models.project import Project
from app.schemas.project import ProjectCreate, ProjectUpdate


class CRUDProject(CRUDBase[Project, ProjectCreate, ProjectUpdate]):
    async def create_project(
        self, db: AsyncSession, *, obj_in: ProjectCreate, auto_commit=True
    ) -> Project:
        obj_in_data = obj_in.dict()
        obj_in_data["organization_id"] = (
            UUID(obj_in_data["organization_id"])
            if isinstance(obj_in_data["organization_id"], str)
            else obj_in_data["organization_id"]
        )
        db_obj = self.model(**obj_in_data)
        db.add(db_obj)
        await db.flush()  # Sends to the DB and should generate an ID
        # Ensuring the object is refreshed to get the latest state, including the ID
        await db.refresh(db_obj)
        if auto_commit:
            await db.commit()  # Finalize transaction
        return db_obj

    async def list_projects_for_organization(
        self,
        db: AsyncSession,
        *,
        organization_id: UUID,
        skip: int = 0,
        limit: int = 100,
    ) -> List[Project]:
        query = (
            select(Project)
            .where(Project.organization_id == organization_id)
            .offset(skip)
            .limit(limit)
        )
        result = await db.execute(query)
        return result.scalars().all()

    async def get_default_project(
        self, db: AsyncSession, organization_id: UUID
    ) -> Optional[Project]:
        query = select(Project).where(
            Project.organization_id == organization_id, Project.is_user_default is True
        )
        result = await db.execute(query)
        return result.scalar_one_or_none()

    async def update_project(
        self, db: AsyncSession, *, db_obj: Project, obj_in: ProjectUpdate
    ) -> Project:
        # If you need specific logic for project update, implement it here
        # Otherwise, you can just call the parent's update method
        return await super().update(db, db_obj=db_obj, obj_in=obj_in)

    async def delete_project(self, db: AsyncSession, *, id: int) -> Project:
        # If you need specific logic for project deletion, implement it here
        # Otherwise, you can just call the parent's remove method
        return await super().remove(db, id=id)


project = CRUDProject(Project)
