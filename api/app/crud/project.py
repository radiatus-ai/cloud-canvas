from typing import Any, List, Optional

from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import joinedload

from app.crud.base import CRUDBase
from app.models.credential import Credential
from app.models.project import Project
from app.schemas.project import ProjectCreate, ProjectUpdate


class CRUDProject(CRUDBase[Project, ProjectCreate, ProjectUpdate]):
    async def create_project(
        self, db: AsyncSession, *, obj_in: ProjectCreate, auto_commit=True
    ) -> Project:
        obj_in_data = obj_in.dict(exclude={"credential_ids"})
        obj_in_data["organization_id"] = (
            UUID(obj_in_data["organization_id"])
            if isinstance(obj_in_data["organization_id"], str)
            else obj_in_data["organization_id"]
        )
        db_obj = self.model(**obj_in_data)

        if obj_in.credential_ids:
            credentials = await db.execute(
                select(Credential).where(Credential.id.in_(obj_in.credential_ids))
            )
            db_obj.credentials = credentials.scalars().all()

        db.add(db_obj)
        await db.flush()
        await db.refresh(db_obj)
        if auto_commit:
            await db.commit()
        return db_obj

    async def get(self, db: AsyncSession, id: Any) -> Optional[Project]:
        query = (
            select(self.model)
            .options(joinedload(self.model.credentials))
            .filter(self.model.id == id)
        )
        result = await db.execute(query)
        return result.scalar_one_or_none()

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
            .options(joinedload(Project.credentials))
            .where(Project.organization_id == organization_id)
            .offset(skip)
            .limit(limit)
        )
        result = await db.execute(query)
        return result.unique().scalars().all()

    async def update_project(
        self, db: AsyncSession, *, db_obj: Project, obj_in: ProjectUpdate
    ) -> Project:
        update_data = obj_in.dict(exclude_unset=True)
        if "credential_ids" in update_data:
            credential_ids = update_data.pop("credential_ids")
            credentials = await db.execute(
                select(Credential).where(Credential.id.in_(credential_ids))
            )
            db_obj.credentials = credentials.scalars().all()
        return await super().update(db, db_obj=db_obj, obj_in=update_data)

    async def delete_project(self, db: AsyncSession, *, id: int) -> Project:
        # If you need specific logic for project deletion, implement it here
        # Otherwise, you can just call the parent's remove method
        return await super().remove(db, id=id)


project = CRUDProject(Project)
