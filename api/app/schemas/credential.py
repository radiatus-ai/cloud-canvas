from typing import Optional

from pydantic import UUID4, BaseModel

from app.models.credential import CredentialType


class CredentialBase(BaseModel):
    credential_type: CredentialType
    credential_value: str


class CredentialCreate(CredentialBase):
    organization_id: UUID4


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
