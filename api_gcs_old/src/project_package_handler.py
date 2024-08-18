from datetime import datetime
from typing import Any, Dict, List, Optional

from deployer import deploy_package, destroy_package
from fastapi import APIRouter, Body, HTTPException, Path, Query
from gcs_service import (
    GCSService,  # Assuming you've put the GCSService in a separate file
)
from jsonschema import validate
from package_utils import (
    DeployStatus,
    delete_package_entry,
    get_connected_input_data,
    get_package_data,
    handle_deployment_error,
    handle_teardown_error,
    update_package_status,
)

# from project_handler import Project
from pydantic import BaseModel, Field

router = APIRouter(
    prefix="/projects/{project_id}/packages",
    tags=["project packages"],
)


class DestroyResponse(BaseModel):
    message: str
    status: str
    command_outputs: List[str]
    deploy_status: DeployStatus


class ProjectPackageBase(BaseModel):
    package_id: str
    name: str
    type: str
    inputs: Dict[str, Any] = Field(default_factory=dict)
    outputs: Dict[str, Any] = Field(default_factory=dict)
    output_data: Dict[str, Any] = Field(default_factory=dict)
    parameters: Dict[str, Any] = Field(default_factory=dict)
    parameter_data: Dict[str, Any] = Field(default_factory=dict)
    position: Dict[str, Any] = Field(default_factory=dict)
    deploy_status: DeployStatus = DeployStatus.UNDEPLOYED
    # TODO: create deployment handler, history, add logs there
    # logs: Dict[str, Any] = Field(default_factory=dict)


class ProjectPackage(ProjectPackageBase):
    id: str
    created_at: datetime
    updated_at: datetime


class ProjectPackageCreate(ProjectPackageBase):
    pass


gcs_service = GCSService()


def get_project_packages_file_name(project_id: str) -> str:
    return f"project/{project_id}/packages.json"


@router.get("/", response_model=List[ProjectPackage])
async def list_project_packages(
    project_id: str = Path(..., title="The ID of the project"),
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
):
    file_name = get_project_packages_file_name(project_id)
    packages = gcs_service.read_json_file(file_name)
    if packages is None:
        return []
    return [ProjectPackage(**package) for package in packages[skip : skip + limit]]


@router.post("/", response_model=ProjectPackage)
async def create_project_package(
    project_package: ProjectPackageCreate,
    project_id: str = Path(..., title="The ID of the project"),
):
    file_name = get_project_packages_file_name(project_id)

    # Fetch the original package
    packages = gcs_service.read_json_file("packages.json")
    original_package = next(
        (p for p in packages if p["id"] == project_package.package_id), None
    )

    if not original_package:
        raise HTTPException(status_code=404, detail="Original package not found")

    # Combine original package with project-specific config
    new_package = {
        **original_package,
        # 'config': project_package.config,
        "package_id": project_package.package_id,
        "name": project_package.name,
        "inputs": {
            **original_package.get("inputs", {"properties": {}}),
            **project_package.inputs,
        },
        "outputs": {
            **original_package.get("outputs", {"properties": {}}),
            **project_package.outputs,
        },
        "parameters": {
            **original_package.get("parameters", {"properties": {}}),
            **project_package.parameters,
        },
    }

    new_id = gcs_service.append_to_json_file(file_name, new_package)
    if new_id:
        project_packages = gcs_service.read_json_file(file_name)
        created_package = next((p for p in project_packages if p["id"] == new_id), None)
        if created_package:
            return ProjectPackage(**created_package)
    raise HTTPException(status_code=500, detail="Failed to create project package")


@router.get("/{package_id}", response_model=ProjectPackage)
async def get_project_package(
    package_id: str, project_id: str = Path(..., title="The ID of the project")
):
    file_name = get_project_packages_file_name(project_id)
    packages = gcs_service.read_json_file(file_name)
    if packages:
        package = next((p for p in packages if p["id"] == package_id), None)
        if package:
            return ProjectPackage(**package)
    raise HTTPException(status_code=404, detail="Project package not found")


@router.put("/{package_id}", response_model=ProjectPackage)
async def update_project_package(
    package_id: str,
    project_package: ProjectPackageCreate,
    project_id: str = Path(..., title="The ID of the project"),
):
    file_name = get_project_packages_file_name(project_id)
    if gcs_service.update_item_in_json_file(
        file_name, package_id, project_package.dict()
    ):
        packages = gcs_service.read_json_file(file_name)
        updated_package = next((p for p in packages if p["id"] == package_id), None)
        if updated_package:
            return ProjectPackage(**updated_package)
    raise HTTPException(status_code=404, detail="Project package not found")


class ProjectPackagePatch(BaseModel):
    name: Optional[str] = None
    parameter_data: Optional[Dict[str, Any]] = None


@router.patch("/{package_id}", response_model=ProjectPackage)
async def patch_project_package(
    package_id: str,
    project_id: str = Path(..., title="The ID of the project"),
    patch_data: ProjectPackagePatch = Body(..., title="Fields to update"),
):
    file_name = get_project_packages_file_name(project_id)
    packages = gcs_service.read_json_file(file_name)

    if not packages:
        raise HTTPException(status_code=404, detail="Project packages not found")

    package = next((p for p in packages if p["id"] == package_id), None)
    if not package:
        raise HTTPException(status_code=404, detail="Project package not found")

    # Update only the fields provided in the patch_data
    update_data = patch_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        if isinstance(value, dict) and field in package:
            # For dict fields, update nested keys instead of replacing the entire dict
            package[field].update(value)
        else:
            package[field] = value

    # Update the 'updated_at' timestamp
    # package['updated_at'] = datetime.now(timezone.utc).isoformat()

    if gcs_service.update_item_in_json_file(file_name, package_id, package):
        return ProjectPackage(**package)
    else:
        raise HTTPException(status_code=500, detail="Failed to update project package")


# @router.delete("/{package_id}")
# async def delete_project_package(
#     package_id: str,
#     project_id: str = Path(..., title="The ID of the project")
# ):
#     file_name = get_project_packages_file_name(project_id)
#     if gcs_service.delete_item_from_json_file(file_name, package_id):
#         return {"message": "Project package deleted successfully"}
#     raise HTTPException(status_code=404, detail="Project package not found")


class DeployResponse(BaseModel):
    message: str
    status: str
    command_outputs: List[str]
    deploy_status: DeployStatus


def get_project_file_name(project_id: str) -> str:
    return f"projects/{project_id}.json"


# Add a new endpoint to get the deploy status
@router.get("/{package_id}/status", response_model=DeployStatus)
async def get_package_deploy_status(
    project_id: str = Path(..., title="The ID of the project"),
    package_id: str = Path(..., title="The ID of the package"),
):
    packages_file = get_project_packages_file_name(project_id)
    packages_data = gcs_service.read_json_file(packages_file)
    if not packages_data:
        raise HTTPException(
            status_code=404, detail="No packages found for this project"
        )

    package = next((p for p in packages_data if p["id"] == package_id), None)
    if not package:
        raise HTTPException(status_code=404, detail="Package not found in this project")

    return package.get("deploy_status", DeployStatus.UNDEPLOYED)


@router.post("/{package_id}/deploy", response_model=DeployResponse)
async def deploy_project_package(
    project_id: str = Path(..., title="The ID of the project"),
    package_id: str = Path(..., title="The ID of the package to deploy"),
):
    package = get_package_data(project_id, package_id)
    connected_input_data = get_connected_input_data(project_id, package_id)

    try:
        validate(instance=connected_input_data, schema=package.get("inputs", {}))

        params_file_path, command_outputs, output_data = deploy_package(
            project_id, package_id, package, connected_input_data
        )

        update_package_status(
            project_id, package_id, DeployStatus.DEPLOYED, output_data
        )

        return DeployResponse(
            message=f"Package {package_id} has been successfully deployed for project {project_id}. "
            f"Parameters written to {params_file_path}. "
            f"Terraform backend configuration written",
            status="success",
            command_outputs=command_outputs,
            deploy_status=DeployStatus.DEPLOYED,
        )
    except Exception as e:
        return handle_deployment_error(project_id, package_id, e)


# @router.delete("/{package_id}/destroy", response_model=DeployResponse)
# async def destroy_project_package(
#     project_id: str = Path(..., title="The ID of the project"),
#     package_id: str = Path(..., title="The ID of the package to destroy")
# ):
#     package = get_package_data(project_id, package_id)
#     connected_input_data = get_connected_input_data(project_id, package_id)

#     update_package_status(project_id, package_id, DeployStatus.DEPLOYING)

#     try:
#         params_file_path, command_outputs = destroy_package(project_id, package_id, package, connected_input_data)

#         update_package_status(project_id, package_id, DeployStatus.UNDEPLOYED)

#         return DeployResponse(
#             message=f"Package {package_id} has been successfully destroyed for project {project_id}.",
#             status="success",
#             command_outputs=command_outputs,
#             deploy_status=DeployStatus.UNDEPLOYED
#         )
#     except Exception as e:
#         return handle_deployment_error(project_id, package_id, e)


@router.delete("/{package_id}/destroy", response_model=DeployResponse)
async def destroy_project_package(
    project_id: str = Path(..., title="The ID of the project"),
    package_id: str = Path(..., title="The ID of the package to tear down"),
):
    package = get_package_data(project_id, package_id)
    connected_input_data = get_connected_input_data(project_id, package_id)

    if package["deploy_status"] == DeployStatus.UNDEPLOYED:
        raise HTTPException(status_code=400, detail="Package is already undeployed")

    update_package_status(project_id, package_id, DeployStatus.DESTROYING)

    try:
        params_file_path, command_outputs = destroy_package(
            project_id, package_id, package, connected_input_data
        )

        update_package_status(project_id, package_id, DeployStatus.UNDEPLOYED)

        return DeployResponse(
            message=f"Package {package_id} has been successfully torn down for project {project_id}.",
            status="success",
            command_outputs=command_outputs,
            deploy_status=DeployStatus.UNDEPLOYED,
        )
    except Exception as e:
        return handle_teardown_error(project_id, package_id, e)


@router.delete("/{package_id}")
async def delete_project_package(
    project_id: str = Path(..., title="The ID of the project"),
    package_id: str = Path(..., title="The ID of the package to delete"),
):
    try:
        delete_package_entry(project_id, package_id)
        return DeployResponse(
            message=f"Package {package_id} has been successfully deleted down for project {project_id}.",
            status="success",
            command_outputs=[],
            deploy_status=DeployStatus.UNDEPLOYED,
        )
    except HTTPException as http_ex:
        raise http_ex
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to delete project package: {str(e)}"
        )
