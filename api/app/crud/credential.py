from typing import List, Optional
from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.crud.base import CRUDBase
from app.models.credential import Credential
from app.schemas.credential import CredentialCreate, CredentialUpdate


class CRUDCredential(CRUDBase[Credential, CredentialCreate, CredentialUpdate]):
    async def get_credentials_by_organization(
        self,
        db: AsyncSession,
        *,
        organization_id: UUID,
        skip: int = 0,
        limit: int = 100,
    ) -> List[Credential]:
        query = (
            select(Credential)
            .where(Credential.organization_id == organization_id)
            .offset(skip)
            .limit(limit)
        )
        result = await db.execute(query)
        return result.scalars().all()

    async def create_credential(
        self, db: AsyncSession, *, obj_in: CredentialCreate, organization_id: UUID
    ) -> Credential:
        db_obj = Credential(**obj_in.dict(), organization_id=organization_id)
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def get_credential(
        self, db: AsyncSession, *, id: UUID
    ) -> Optional[Credential]:
        query = select(Credential).where(Credential.id == id)
        result = await db.execute(query)
        return result.scalars().first()

    async def delete_credential(self, db: AsyncSession, *, id: UUID) -> Credential:
        credential = await self.get(db, id=id)
        if credential:
            await db.delete(credential)
            await db.commit()
        return credential


credential = CRUDCredential(Credential)
