from typing import Optional

from pydantic import UUID4, BaseModel

from app.models.credential import CredentialType


class CredentialBase(BaseModel):
    credential_type: CredentialType
    name: str
    # CREDENTIAL VALUE IS NOT RETURNED FROM THIS API ON PURPOSE
    # credential_value: str


class CredentialCreate(CredentialBase):
    credential_value: str


class CredentialUpdate(BaseModel):
    credential_type: Optional[CredentialType] = None
    credential_value: Optional[str] = None


class Credential(CredentialBase):
    id: UUID4
    organization_id: UUID4

    class Config:
        from_attributes = True


class CredentialInDB(Credential):
    pass
