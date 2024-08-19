from enum import Enum
from typing import Any, Dict, Optional

from pydantic import UUID4, BaseModel


class DeployStatus(str, Enum):
    NOT_DEPLOYED = "NOT_DEPLOYED"
    DEPLOYING = "DEPLOYING"
    DEPLOYED = "DEPLOYED"
    FAILED = "FAILED"


class ProjectPackageBase(BaseModel):
    name: str
    type: str
    inputs: Dict[str, Any]
    outputs: Dict[str, Any]
    parameters: Dict[str, Any]


class ProjectPackageCreate(ProjectPackageBase):
    project_id: UUID4


class ProjectPackageUpdate(BaseModel):
    name: Optional[str] = None
    type: Optional[str] = None
    inputs: Optional[Dict[str, Any]] = None
    outputs: Optional[Dict[str, Any]] = None
    parameters: Optional[Dict[str, Any]] = None


class ProjectPackage(ProjectPackageBase):
    id: UUID4
    project_id: UUID4
    deploy_status: DeployStatus
    output_data: Optional[Dict[str, Any]] = None
    parameter_data: Optional[Dict[str, Any]] = None

    class Config:
        from_attributes = True
