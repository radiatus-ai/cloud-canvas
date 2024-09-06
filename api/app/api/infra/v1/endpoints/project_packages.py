import json
from typing import List

from fastapi import (
    APIRouter,
    Body,
    Depends,
    HTTPException,
    Path,
    Query,
)
from pydantic import UUID4

from app.core.dependencies import (
    get_db_and_current_user,
    get_websocket_manager,
)
from app.core.logger import get_logger
from app.core.websocket_manager import ConnectionManager
from app.crud.connection import connection as crud_connection
from app.crud.project_package import project_package as crud_project_package
from app.schemas.project_package import (
    ProjectPackage,
    ProjectPackageCreate,
    ProjectPackageUpdate,
)

logger = get_logger(__name__)

# Initialize ConnectionManager
# connection_manager = ConnectionManager()

router = APIRouter(
    prefix="/projects/{project_id}/packages", tags=["project", "packages"]
)


@router.get("/", response_model=List[ProjectPackage])
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


@router.post("/", response_model=ProjectPackage)
async def create_project_package(
    project_id: UUID4 = Path(..., description="The ID of the project"),
    package: ProjectPackageCreate = Body(...),
    deps: dict = Depends(get_db_and_current_user),
):
    db = deps["db"]
    return await crud_project_package.create_project_package(
        db, obj_in=package, project_id=project_id
    )


@router.get("/{package_id}", response_model=ProjectPackage)
async def get_project_package(
    project_id: UUID4 = Path(..., description="The ID of the project"),
    package_id: UUID4 = Path(..., description="The ID of the package"),
    deps: dict = Depends(get_db_and_current_user),
):
    db = deps["db"]
    package = await crud_project_package.get_package(db, id=package_id)
    if not package or package.project_id != project_id:
        raise HTTPException(
            status_code=404, detail="ProjectPackage not found in this project"
        )
    return package


@router.patch("/{package_id}", response_model=ProjectPackage)
async def update_project_package(
    project_id: UUID4 = Path(..., description="The ID of the project"),
    package_id: UUID4 = Path(..., description="The ID of the package"),
    package: ProjectPackageUpdate = Body(...),
    deps: dict = Depends(get_db_and_current_user),
    websocket_manager: ConnectionManager = Depends(get_websocket_manager),
):
    db = deps["db"]
    existing_package = await crud_project_package.get_package(
        db, id=package_id, project_id=project_id
    )
    if not existing_package or existing_package.project_id != project_id:
        raise HTTPException(
            status_code=404, detail="ProjectPackage not found in this project"
        )

    updated_package = await crud_project_package.update_package(
        db, db_obj=existing_package, obj_in=package
    )

    # Convert SQLAlchemy model to Pydantic model
    package_pydantic = ProjectPackage.from_orm(updated_package)
    # await websocket_manager.publish_message(
    #     json.dumps({"type": "package_update", "data": package_pydantic.dict()})
    # )
    await websocket_manager.broadcast_package_update(
        package_id,
        {
            "id": str(package_id),
            "deploy_status": package.deploy_status.value,
        },
    )

    # Broadcast the update to all connected WebSocket clients
    await websocket_manager.broadcast_package_update(
        package_id=package_id,
        package_data=package_pydantic.dict(),
    )

    return updated_package


@router.post("/{package_id}/deploy", response_model=ProjectPackage)
async def deploy_project_package(
    project_id: UUID4 = Path(..., description="The ID of the project"),
    package_id: UUID4 = Path(..., description="The ID of the package"),
    deps: dict = Depends(get_db_and_current_user),
    websocket_manager: ConnectionManager = Depends(get_websocket_manager),
):
    db = deps["db"]
    logger.info(f"Deploying package {package_id} for project {project_id}")

    try:
        # Send initial "DEPLOYING" status
        await websocket_manager.broadcast_package_update(
            package_id,
            {
                "id": str(package_id),
                "deploy_status": "DEPLOYING",
            },
        )
        logger.info(f"Sent DEPLOYING status for package {package_id}")

        # Deploy the package
        pack = await crud_project_package.deploy_package(
            db,
            project_id=project_id,
            package_id=package_id,
        )
        logger.info(
            f"Package {package_id} deployed with status: {pack.deploy_status.value}"
        )

        # Send final deployment status
        await websocket_manager.broadcast_package_update(
            package_id,
            {
                "id": str(package_id),
                "deploy_status": pack.deploy_status.value,
            },
        )
        logger.info(
            f"Sent final status {pack.deploy_status.value} for package {package_id}"
        )

        return pack
    except Exception as e:
        logger.error(f"Error deploying package {package_id}: {str(e)}")
        # Send error status
        await websocket_manager.broadcast_package_update(
            package_id,
            json.dumps(
                {
                    "id": str(package_id),
                    "deploy_status": "FAILED",
                    "error": str(e),
                }
            ),
        )
        raise HTTPException(
            status_code=500, detail=f"Deployment failed: {str(e)}"
        ) from e


@router.delete("/{package_id}/destroy", response_model=ProjectPackage)
async def destroy_project_package(
    project_id: UUID4 = Path(..., description="The ID of the project"),
    package_id: UUID4 = Path(..., description="The ID of the package"),
    deps: dict = Depends(get_db_and_current_user),
    websocket_manager: ConnectionManager = Depends(get_websocket_manager),
):
    db = deps["db"]
    await websocket_manager.broadcast_package_update(
        package_id,
        {
            "id": str(package_id),
            "deploy_status": "DESTROYING",
        },
    )
    package = await crud_project_package.destroy_package(
        db, project_id=project_id, package_id=package_id
    )
    await websocket_manager.broadcast_package_update(
        package_id,
        {
            "id": str(package_id),
            "deploy_status": "NOT_DEPLOYED",
        },
    )
    return package


@router.delete("/{package_id}")
async def delete_project_package(
    project_id: UUID4 = Path(..., description="The ID of the project"),
    package_id: UUID4 = Path(..., description="The ID of the package"),
    deps: dict = Depends(get_db_and_current_user),
    websocket_manager: ConnectionManager = Depends(get_websocket_manager),
):
    db = deps["db"]
    await websocket_manager.broadcast_package_update(
        package_id,
        {
            "id": str(package_id),
            "deploy_status": "DELETING",
        },
    )
    # Check if the package exists and is in the NOT_DEPLOYED state
    package = await crud_project_package.get_package(
        db, id=package_id, project_id=project_id
    )
    if not package:
        raise HTTPException(
            status_code=404, detail="ProjectPackage not found in this project"
        )

    if package.deploy_status.value != "NOT_DEPLOYED":
        raise HTTPException(
            status_code=400,
            detail="Cannot delete a deployed package. Please destroy it first.",
        )

    # Delete connections where this package is the target
    await crud_connection.delete_connections_by_target(db, target_package_id=package_id)

    # Delete the package
    deleted_package = await crud_project_package.delete_package(
        db, id=package_id, project_id=project_id
    )

    # Broadcast the deletion
    await websocket_manager.broadcast_package_update(
        package_id,
        {
            "id": str(package_id),
            "deploy_status": "DELETED",
        },
    )

    return {"message": "Package and associated connections deleted"}
