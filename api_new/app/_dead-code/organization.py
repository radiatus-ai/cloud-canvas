from platform.api.app.models.organization_old import Organization

from app.crud.base import CRUDBase
from app.schemas.organization import OrganizationCreate, OrganizationUpdate


class CRUDOrganization(CRUDBase[Organization, OrganizationCreate, OrganizationUpdate]):
    # Add any organization-specific methods here
    pass


organization = CRUDOrganization(Organization)
