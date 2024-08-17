from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from app.crud.base import CRUDBase
from app.models.organization_reference import OrganizationReference
from app.schemas.organization import (
    OrganizationReferenceCreate,
    OrganizationReferenceUpdate,
)


class CRUDOrganizationReference(
    CRUDBase[
        OrganizationReference, OrganizationReferenceCreate, OrganizationReferenceUpdate
    ]
):
    async def get_or_create(
        self, db: AsyncSession, *, id: UUID, name: str = "Default Organization"
    ) -> OrganizationReference:
        org_ref = await self.get(db, id=id)
        if not org_ref:
            org_ref_in = OrganizationReferenceCreate(id=id, name=name)
            org_ref = await self.create(db, obj_in=org_ref_in)
        return org_ref


organization_reference = CRUDOrganizationReference(OrganizationReference)
