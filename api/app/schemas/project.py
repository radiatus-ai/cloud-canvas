from typing import Optional

from pydantic import UUID4, BaseModel


class ProjectBase(BaseModel):
    name: str


class ProjectCreate(ProjectBase):
    organization_id: Optional[UUID4] = None

    class Config:
        json_encoders = {UUID4: str}


class ProjectUpdate(BaseModel):
    name: Optional[str] = None


class Project(ProjectBase):
    id: UUID4
    organization_id: UUID4

    class Config:
        from_attributes = True
