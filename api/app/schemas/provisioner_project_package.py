from typing import Any, Dict, Optional

from pydantic import BaseModel

from app.schemas.project_package import DeployStatus


# only allow certain fields to be updated by the provisioner
class ProjectPackageUpdate(BaseModel):
    # name: Optional[str] = None
    # type: Optional[str] = None
    # inputs: Optional[Dict[str, Any]] = None
    # outputs: Optional[Dict[str, Any]] = None
    # parameters: Optional[Dict[str, Any]] = None
    deploy_status: Optional[DeployStatus] = DeployStatus.NOT_DEPLOYED
    output_data: Optional[Dict[str, Any]] = None
    # parameter_data: Optional[Dict[str, Any]] = None
