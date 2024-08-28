from typing import Any, Dict, Optional

from pydantic import UUID4, BaseModel

from app.models.project_package import ProjectPackageStatus


class ProjectPackageBase(BaseModel):
    name: str
    type: str
    inputs: Dict[str, Any]
    outputs: Dict[str, Any]
    parameters: Dict[str, Any]


class ProjectPackageCreate(ProjectPackageBase):
    deploy_status: Optional[ProjectPackageStatus] = ProjectPackageStatus.NOT_DEPLOYED
    pass


class ProjectPackageUpdate(BaseModel):
    name: Optional[str] = None
    type: Optional[str] = None
    inputs: Optional[Dict[str, Any]] = None
    outputs: Optional[Dict[str, Any]] = None
    parameters: Optional[Dict[str, Any]] = None
    deploy_status: Optional[ProjectPackageStatus] = ProjectPackageStatus.NOT_DEPLOYED
    output_data: Optional[Dict[str, Any]] = None
    parameter_data: Optional[Dict[str, Any]] = None


class ProjectPackage(ProjectPackageBase):
    id: UUID4
    project_id: UUID4
    deploy_status: ProjectPackageStatus
    output_data: Optional[Dict[str, Any]] = None
    parameter_data: Optional[Dict[str, Any]] = None

    class Config:
        from_attributes = True
