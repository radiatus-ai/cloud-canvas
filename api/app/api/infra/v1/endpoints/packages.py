import json
from typing import List

from core.pubsub import PubSubMessenger
from fastapi import (
    APIRouter,
    Body,
    Depends,
    Path,
)
from pydantic import UUID4

from app.core.dependencies import (
    get_db_and_current_user,
    get_pubsub_messenger,
    get_websocket_manager,
)
from app.core.logger import get_logger
from app.core.websocket_manager import ConnectionManager
from app.crud.package import package as crud_package
from app.schemas.package import (
    Package,
    PackageCreate,
    PackageUpdate,
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


@router.put("/packages/{package_id}", response_model=Package)
async def create_or_update_package(
    package_id: UUID4 = Path(..., description="The ID of the package"),
    package: PackageUpdate = Body(...),
    deps: dict = Depends(get_db_and_current_user),
    pubsub: PubSubMessenger = Depends(get_pubsub_messenger),
    websocket_manager: ConnectionManager = Depends(get_websocket_manager),
):
    db = deps["db"]

    updated_package = await crud_package.create_or_replace_package(
        db, obj_in=package, package_id=package_id
    )

    # Convert SQLAlchemy model to Pydantic model
    package_pydantic = Package.from_orm(updated_package)

    # Broadcast the update to all connected WebSocket clients
    await websocket_manager.broadcast(f"Package updated: {package_pydantic.name}")

    # Publish message to PubSub
    pubsub.publish_message(
        json.dumps({"type": "package_update", "data": package_pydantic.dict()})
    )

    return updated_package
