from os import environ

from fastapi import APIRouter, Body, Depends, Header, HTTPException, Path
from pydantic import UUID4

from app.core.dependencies import get_db_and_current_user
from app.crud.project_package import project_package as crud_project_package
from app.schemas.project_package import (
    ProjectPackage,
    ProjectPackageUpdate,
)

# this router exists as a temporary way for the provisioner to send updates to the api.
# the provision will send a success / fail for every package and on success needs to write the output data (artifacts) to the database


def verify_canvas_token(x_canvas_token: str = Header(...)):
    # todo move to config py
    expected_token = environ.get("CANVAS_API_TOKEN")
    if not expected_token:
        raise HTTPException(status_code=500, detail="CANVAS_API_TOKEN not set")
    if x_canvas_token != expected_token:
        raise HTTPException(status_code=403, detail="Invalid Canvas API token")
    return x_canvas_token


router = APIRouter(
    prefix="/projects/{project_id}/packages", tags=["project", "packages"]
)


@router.patch("/{package_id}", response_model=ProjectPackage)
async def update_project_package(
    project_id: UUID4 = Path(..., description="The ID of the project"),
    package_id: UUID4 = Path(..., description="The ID of the package"),
    package: ProjectPackageUpdate = Body(...),
    deps: dict = Depends(get_db_and_current_user),
    _: str = Depends(verify_canvas_token),
):
    db = deps["db"]
    existing_package = await crud_project_package.get_package(
        db, id=package_id, project_id=project_id
    )
    if not existing_package or existing_package.project_id != project_id:
        raise HTTPException(
            status_code=404, detail="ProjectPackage not found in this project"
        )

    return await crud_project_package.update_package(
        db, db_obj=existing_package, obj_in=package
    )
