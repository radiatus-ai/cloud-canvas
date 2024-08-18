from typing import List

from fastapi import APIRouter, Body, Depends, HTTPException
from pydantic import UUID4

from app.core.dependencies import get_db_and_current_user
from app.crud.package import package as crud_package
from app.schemas.package import Package, PackageCreate, PackageUpdate

router = APIRouter()


# lists all packages available
@router.get("/packages/", response_model=List[Package])
async def list_all_packages(
    skip: int = 0, limit: int = 100, deps: dict = Depends(get_db_and_current_user)
):
    db = deps["db"]
    return await crud_package.get_packages(db, skip=skip, limit=limit)


# a project package is a copy of the mainline packages. copied when drug to the canvas
@router.get("/projects/{project_id}/packages/", response_model=List[Package])
async def list_packages(
    project_id: UUID4, deps: dict = Depends(get_db_and_current_user)
):
    db = deps["db"]
    return await crud_package.get_packages_by_project(db, project_id=project_id)


@router.post("/projects/{project_id}/packages/", response_model=Package)
async def create_package(
    project_id: UUID4,
    package: PackageCreate,
    deps: dict = Depends(get_db_and_current_user),
):
    db = deps["db"]
    return await crud_package.create_package(db, obj_in=package, project_id=project_id)


@router.patch("/projects/{project_id}/packages/{package_id}", response_model=Package)
async def update_package(
    project_id: UUID4,
    package_id: UUID4,
    package: PackageUpdate,
    deps: dict = Depends(get_db_and_current_user),
):
    db = deps["db"]
    existing_package = await crud_package.get_package(db, id=package_id)
    if not existing_package:
        raise HTTPException(status_code=404, detail="Package not found")
    return await crud_package.update_package(
        db, db_obj=existing_package, obj_in=package
    )


@router.post(
    "/projects/{project_id}/packages/{package_id}/deploy", response_model=Package
)
async def deploy_package(
    project_id: UUID4,
    package_id: UUID4,
    deploy_data: dict = Body(...),
    deps: dict = Depends(get_db_and_current_user),
):
    db = deps["db"]
    return await crud_package.deploy_package(
        db, project_id=project_id, package_id=package_id, deploy_data=deploy_data
    )


@router.delete(
    "/projects/{project_id}/packages/{package_id}/destroy", response_model=Package
)
async def destroy_package(
    project_id: UUID4, package_id: UUID4, deps: dict = Depends(get_db_and_current_user)
):
    db = deps["db"]
    return await crud_package.destroy_package(
        db, project_id=project_id, package_id=package_id
    )


@router.delete("/projects/{project_id}/packages/{package_id}", response_model=Package)
async def delete_package(
    project_id: UUID4, package_id: UUID4, deps: dict = Depends(get_db_and_current_user)
):
    db = deps["db"]
    package = await crud_package.get_package(db, id=package_id)
    if not package:
        raise HTTPException(status_code=404, detail="Package not found")
    return await crud_package.delete_package(db, id=package_id)
