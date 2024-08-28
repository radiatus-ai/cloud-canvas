import json
from typing import List

from fastapi import (
    APIRouter,
    Body,
    Depends,
    HTTPException,
    Path,
    Query,
    WebSocket,
)
from pydantic import UUID4

from app.core.dependencies import get_db_and_current_user, get_db_without_trace
from app.core.logger import get_logger
from app.core.websocket_manager import ConnectionManager
from app.crud.project_package import project_package as crud_project_package
from app.schemas.project_package import (
    ProjectPackage,
    ProjectPackageCreate,
    ProjectPackageUpdate,
)

logger = get_logger(__name__)

# Initialize ConnectionManager
connection_manager = ConnectionManager()

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

    # Broadcast the update to all connected WebSocket clients
    await broadcast_package_update(
        package_id=package_id, package_data=package_pydantic.dict()
    )

    return updated_package


@router.post("/{package_id}/deploy", response_model=ProjectPackage)
async def deploy_project_package(
    project_id: UUID4 = Path(..., description="The ID of the project"),
    package_id: UUID4 = Path(..., description="The ID of the package"),
    deps: dict = Depends(get_db_and_current_user),
):
    db = deps["db"]
    return await crud_project_package.deploy_package(
        db,
        project_id=project_id,
        package_id=package_id,
    )


@router.delete("/{package_id}/destroy", response_model=ProjectPackage)
async def destroy_project_package(
    project_id: UUID4 = Path(..., description="The ID of the project"),
    package_id: UUID4 = Path(..., description="The ID of the package"),
    deps: dict = Depends(get_db_and_current_user),
):
    db = deps["db"]
    return await crud_project_package.destroy_package(
        db, project_id=project_id, package_id=package_id
    )


@router.delete("/{package_id}", response_model=ProjectPackage)
async def delete_project_package(
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
    return await crud_project_package.delete_package(db, id=package_id)


socket_router = APIRouter(
    prefix="/projects/{project_id}/packages", tags=["project", "packages"]
)

from fastapi import WebSocketDisconnect


@socket_router.websocket("/{package_id}/ws")
async def websocket_endpoint(
    websocket: WebSocket,
    project_id: UUID4 = Path(..., description="The ID of the project"),
    package_id: UUID4 = Path(..., description="The ID of the package"),
    deps: dict = Depends(get_db_without_trace),
):
    await websocket.accept()
    # await connection_manager.connect(websocket, project_id, package_id)
    try:
        await connection_manager.connect(websocket, project_id, package_id)

        while True:
            data = await websocket.receive_text()
            try:
                message = json.loads(data)
                logger.info(f"Received message: {message}")
                db = deps["db"]
                package = await crud_project_package.get_package(
                    db, id=package_id, project_id=project_id
                )
                logger.info(f"Package: {package}")
                status = package.deploy_status
                logger.info(f"Package: {status}")
                if (
                    message.get("type") == "request_update"
                    or message.get("type") == "package_update"
                ):
                    # if package and package.project_id == project_id:
                    #     await websocket.send_text(json.dumps({
                    #         "type": "package_update",
                    #         "data": package.dict()
                    #     }))
                    # else:
                    # await websocket.send_text(json.dumps({
                    #     "type": "package_update",
                    #     "data": {"id": "53af8da2-dfcb-45e4-98ab-d8cf244c0850", "deploy_status": "DEPLOYING"}
                    # }))
                    logger.info(f"Sending package update for {package_id}")
                    await websocket.send_text(
                        json.dumps(
                            {
                                "type": "package_update",
                                "data": {
                                    "id": str(package_id),
                                    "deploy_status": status.value,
                                },
                            }
                        )
                    )
                elif message.get("type") == "request_initial":
                    logger.info(f"Sending initial package update for {package_id}")
                    await websocket.send_text(
                        json.dumps(
                            {
                                "type": "package_update",
                                "data": {
                                    "id": str(package_id),
                                    "deploy_status": status.value,
                                },
                            }
                        )
                    )
            except json.JSONDecodeError:
                logger.error(f"Received invalid JSON: {data}")
                await websocket.send_text(
                    json.dumps({"type": "error", "message": "Invalid JSON received"})
                )
    except WebSocketDisconnect:
        logger.info(
            f"WebSocket disconnected for project {project_id}, package {package_id}"
        )
    finally:
        connection_manager.disconnect(websocket)


async def broadcast_package_update(package_id: UUID4, package_data: dict):
    message = json.dumps({"type": "package_update", "data": package_data}, default=str)
    logger.info(f"Broadcasting message: {message}")
    await connection_manager.broadcast_to_package(package_id, message)
