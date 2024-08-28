from typing import Any, Dict, Optional

from pydantic import BaseModel

from app.models.project_package import ProjectPackageStatus


# only allow certain fields to be updated by the provisioner
class ProjectPackageUpdate(BaseModel):
    # name: Optional[str] = None
    # type: Optional[str] = None
    # inputs: Optional[Dict[str, Any]] = None
    # outputs: Optional[Dict[str, Any]] = None
    # parameters: Optional[Dict[str, Any]] = None
    deploy_status: ProjectPackageStatus
    # deploy_status: str
    output_data: Optional[Dict[str, Any]] = None
    # parameter_data: Optional[Dict[str, Any]] = None

    # ugh so important
    class Config:
        use_enum_values = True
