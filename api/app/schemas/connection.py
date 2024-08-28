from typing import Optional

from pydantic import UUID4, BaseModel


class ConnectionBase(BaseModel):
    source_package_id: UUID4
    target_package_id: UUID4
    source_handle: str
    target_handle: str


class ConnectionCreate(ConnectionBase):
    pass


class ConnectionUpdate(BaseModel):
    source_package_id: Optional[UUID4] = None
    target_package_id: Optional[UUID4] = None
    source_handle: Optional[str] = None
    target_handle: Optional[str] = None


class Connection(ConnectionBase):
    id: UUID4
    project_id: UUID4

    class Config:
        from_attributes = True
