# app/crud/credential.py

from typing import List, Optional

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.crud.base import CRUDBase
from app.models.credential import Credential
from app.schemas.credential import CredentialCreate, CredentialUpdate


class CRUDCredential(CRUDBase[Credential, CredentialCreate, CredentialUpdate]):
    async def create_with_organization(
        self, db: AsyncSession, *, obj_in: CredentialCreate, organization_id: int
    ) -> Credential:
        db_obj = Credential(
            name=obj_in.name,
            credential_type=obj_in.credential_type,
            metadata=obj_in.metadata,
            organization_id=organization_id,
        )
        db_obj.set_data(obj_in.data)
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def get_multi_by_organization(
        self, db: AsyncSession, *, organization_id: int, skip: int = 0, limit: int = 100
    ) -> List[Credential]:
        query = (
            select(Credential)
            .filter(Credential.organization_id == organization_id)
            .offset(skip)
            .limit(limit)
        )
        result = await db.execute(query)
        return result.scalars().all()

    async def update(
        self, db: AsyncSession, *, db_obj: Credential, obj_in: CredentialUpdate
    ) -> Credential:
        if isinstance(obj_in, dict):
            update_data = obj_in
        else:
            update_data = obj_in.dict(exclude_unset=True)

        if "data" in update_data:
            db_obj.set_data(update_data["data"])
            del update_data["data"]

        return await super().update(db, db_obj=db_obj, obj_in=update_data)

    async def get_by_name_and_organization(
        self, db: AsyncSession, *, name: str, organization_id: int
    ) -> Optional[Credential]:
        query = select(Credential).filter(
            Credential.name == name, Credential.organization_id == organization_id
        )
        result = await db.execute(query)
        return result.scalar_one_or_none()


credential = CRUDCredential(Credential)
