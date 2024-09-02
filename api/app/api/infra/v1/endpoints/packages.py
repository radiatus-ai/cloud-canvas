# Ada helps manage this file
from typing import List

from fastapi import (
    APIRouter,
    Depends,
)

from app.core.dependencies import (
    get_db_and_current_user,
)
from app.core.logger import get_logger
from app.crud.package import package as crud_package
from app.schemas.package import (
    Package,
    PackageCreate,
)

logger = get_logger(__name__)

router = APIRouter()


# lists all packages available
@router.get("/packages", response_model=List[Package])
async def list_all_packages(
    skip: int = 0, limit: int = 100, deps: dict = Depends(get_db_and_current_user)
):
    db = deps["db"]
    return await crud_package.get_packages(db, skip=skip, limit=limit)


# todo: this needs much more work. a package registry that's org-specific and permissioned
@router.post("/packages", response_model=Package)
async def create_global_package(
    package: PackageCreate,
    deps: dict = Depends(get_db_and_current_user),
):
    db = deps["db"]
    return await crud_package.create_package(db, obj_in=package)


@router.post("/packages/create-or-update", response_model=Package)
async def create_or_update_global_package(
    package: PackageCreate,
    deps: dict = Depends(get_db_and_current_user),
):
    db = deps["db"]
    updated_package = await crud_package.create_or_replace_package(db, obj_in=package)

    return updated_package


# @ada moved to project_packages
