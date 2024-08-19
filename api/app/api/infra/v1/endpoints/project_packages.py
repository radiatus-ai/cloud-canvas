from typing import List

from fastapi import APIRouter, Body, Depends, HTTPException, Path, Query
from pydantic import UUID4

from app.core.dependencies import get_db_and_current_user
from app.crud.project_package import project_package as crud_project_package
from app.schemas.package import Package, PackageCreate, PackageUpdate

router = APIRouter(
    prefix="/projects/{project_id}/packages", tags=["project", "packages"]
)


@router.get("/", response_model=List[Package])
async def list_project_packages(
    project_id: UUID4 = Path(..., description="The ID of the project"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    deps: dict = Depends(get_db_and_current_user),
):
    db = deps["db"]
    return await crud_project_package.get_packages_by_project(
        db, project_id=project_id, skip=skip, limit=limit
    )


@router.post("/", response_model=Package)
async def create_project_package(
    project_id: UUID4 = Path(..., description="The ID of the project"),
    package: PackageCreate = Body(...),
    deps: dict = Depends(get_db_and_current_user),
):
    db = deps["db"]
    return await crud_project_package.create_project_package(
        db, obj_in=package, project_id=project_id
    )


@router.get("/{package_id}", response_model=Package)
async def get_project_package(
    project_id: UUID4 = Path(..., description="The ID of the project"),
    package_id: UUID4 = Path(..., description="The ID of the package"),
    deps: dict = Depends(get_db_and_current_user),
):
    db = deps["db"]
    package = await crud_project_package.get_package(db, id=package_id)
    if not package or package.project_id != project_id:
        raise HTTPException(status_code=404, detail="Package not found in this project")
    return package


@router.patch("/{package_id}", response_model=Package)
async def update_project_package(
    project_id: UUID4 = Path(..., description="The ID of the project"),
    package_id: UUID4 = Path(..., description="The ID of the package"),
    package: PackageUpdate = Body(...),
    deps: dict = Depends(get_db_and_current_user),
):
    db = deps["db"]
    existing_package = await crud_project_package.get_package(db, id=package_id)
    if not existing_package or existing_package.project_id != project_id:
        raise HTTPException(status_code=404, detail="Package not found in this project")
    return await crud_project_package.update_package(
        db, db_obj=existing_package, obj_in=package
    )


@router.post("/{package_id}/deploy", response_model=Package)
async def deploy_project_package(
    project_id: UUID4 = Path(..., description="The ID of the project"),
    package_id: UUID4 = Path(..., description="The ID of the package"),
    deploy_data: dict = Body(...),
    deps: dict = Depends(get_db_and_current_user),
):
    db = deps["db"]
    return await crud_project_package.deploy_package(
        db, project_id=project_id, package_id=package_id, deploy_data=deploy_data
    )


@router.delete("/{package_id}/destroy", response_model=Package)
async def destroy_project_package(
    project_id: UUID4 = Path(..., description="The ID of the project"),
    package_id: UUID4 = Path(..., description="The ID of the package"),
    deps: dict = Depends(get_db_and_current_user),
):
    db = deps["db"]
    return await crud_project_package.destroy_package(
        db, project_id=project_id, package_id=package_id
    )


@router.delete("/{package_id}", response_model=Package)
async def delete_project_package(
    project_id: UUID4 = Path(..., description="The ID of the project"),
    package_id: UUID4 = Path(..., description="The ID of the package"),
    deps: dict = Depends(get_db_and_current_user),
):
    db = deps["db"]
    package = await crud_project_package.get_package(db, id=package_id)
    if not package or package.project_id != project_id:
        raise HTTPException(status_code=404, detail="Package not found in this project")
    return await crud_project_package.delete_package(db, id=package_id)
