from enum import Enum
from typing import Dict, Optional

from pydantic import UUID4, BaseModel, Field

### pay attention!
# think about credentials haveing an org id and a project id.

# the github way is credentials per user but I think they can be by org as well.
# the gcp way is credentials are project level, everything is associated with a project
# but access can be granted to other projects.
# i think i want both / all
# the api key makes the CLI and the github bot super easy.

# 1. I think I want them at least at the org level.
# 2. I think it would be clever to add a project id while im at it for future use
# 3. make it clear that credentials are used by ada to access other services and that api tokens are used to access the ada api.
# 4. even google static credentials are for an identity

# #### late-night summary ###
# integrations (credentials):
# anthropic
# weather api
# yadda yadda

# ada auth:
# signup with google account -> creates an identity
# api token -> creates an identity
# both can be assigned to orgs and projects the same way.
# investigate scopes
# invegstiage rbac


class CredentialType(str, Enum):
    API_KEY = "api_key"
    GITHUB_PAT = "github_pat"
    GCP_SERVICE_ACCOUNT = "gcp_service_account"
    OTHER = "other"


class CredentialBase(BaseModel):
    name: str
    credential_type: CredentialType
    metadata: Optional[Dict] = Field(default_factory=dict)


class CredentialCreate(CredentialBase):
    data: Dict


class CredentialUpdate(BaseModel):
    name: Optional[str] = None
    credential_type: Optional[CredentialType] = None
    metadata: Optional[Dict] = None
    data: Optional[Dict] = None


class CredentialInDBBase(CredentialBase):
    id: UUID4
    organization_id: UUID4

    class Config:
        from_attributes = True


class Credential(CredentialInDBBase):
    pass


class CredentialInDB(CredentialInDBBase):
    encrypted_data: str
