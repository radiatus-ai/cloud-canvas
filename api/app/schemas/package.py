from typing import Any, Dict, Optional

from pydantic import UUID4, BaseModel


class PackageBase(BaseModel):
    name: str
    type: str
    inputs: Dict[str, Any]
    outputs: Dict[str, Any]
    parameters: Dict[str, Any]
    private: Optional[bool] = True


class PackageCreate(PackageBase):
    pass


class PackageUpdate(BaseModel):
    name: Optional[str] = None
    type: Optional[str] = None
    inputs: Optional[Dict[str, Any]] = None
    outputs: Optional[Dict[str, Any]] = None
    parameters: Optional[Dict[str, Any]] = None
    private: Optional[bool] = None


class Package(PackageBase):
    id: UUID4

    class Config:
        from_attributes = True
