from typing import List, Optional

from pydantic import UUID4, BaseModel

from app.schemas.credential import Credential


class ProjectBase(BaseModel):
    name: str


class ProjectCreate(ProjectBase):
    organization_id: Optional[UUID4] = None
    credential_ids: Optional[List[UUID4]] = None

    class Config:
        json_encoders = {UUID4: str}


class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    credential_ids: Optional[List[UUID4]] = None


class Project(ProjectBase):
    id: UUID4
    organization_id: UUID4
    credentials: List[Credential] = []

    class Config:
        from_attributes = True


class ProjectInDB(Project):
    pass
