import json

from fastapi import (
    APIRouter,
    Depends,
    Path,
    WebSocket,
    WebSocketDisconnect,
)
from pydantic import UUID4

from app.core.dependencies import (
    get_db_without_trace,
    get_websocket_manager,
)
from app.core.logger import get_logger
from app.core.websocket_manager import ConnectionManager
from app.crud.project_package import project_package as crud_project_package

logger = get_logger(__name__)

router = APIRouter(
    prefix="/projects/{project_id}/packages", tags=["project", "packages"]
)


@router.websocket("/{package_id}/ws")
async def websocket_endpoint(
    websocket: WebSocket,
    project_id: UUID4 = Path(..., description="The ID of the project"),
    package_id: UUID4 = Path(..., description="The ID of the package"),
    deps: dict = Depends(get_db_without_trace),
    websocket_manager: ConnectionManager = Depends(get_websocket_manager),
):
    await websocket.accept()
    logger.info(f"WebSocket connection accepted for package {package_id}")
    try:
        await websocket_manager.connect(websocket, project_id, package_id)

        while True:
            try:
                data = await websocket.receive_text()
                message = json.loads(data)
                logger.info(f"Received message for package {package_id}: {message}")

                db = deps["db"]
                package = await crud_project_package.get_package(
                    db, id=package_id, project_id=project_id
                )

                if message.get("type") in [
                    "request_update",
                    "package_update",
                    "request_initial",
                ]:
                    await send_package_update(
                        websocket,
                        package_id,
                        package.deploy_status.value if package else "UNKNOWN",
                    )
                else:
                    await websocket.send_text(
                        json.dumps({"type": "error", "message": "Invalid message type"})
                    )
            except WebSocketDisconnect:
                logger.info(f"WebSocket disconnected for package {package_id}")
                break
            except json.JSONDecodeError:
                logger.error(f"Received invalid JSON for package {package_id}: {data}")
                await websocket.send_text(
                    json.dumps({"type": "error", "message": "Invalid JSON received"})
                )
            except Exception as e:
                logger.error(
                    f"Error processing message for package {package_id}: {str(e)}"
                )
                await websocket.send_text(
                    json.dumps({"type": "error", "message": "Internal server error"})
                )
    finally:
        websocket_manager.disconnect(websocket)
        logger.info(f"WebSocket connection closed for package {package_id}")


async def send_package_update(websocket: WebSocket, package_id: UUID4, status: str):
    try:
        message = json.dumps(
            {
                "type": "package_update",
                "data": {
                    "id": str(package_id),
                    "deploy_status": status,
                },
            }
        )
        logger.info(f"Sending package update for {package_id}: {message}")
        await websocket.send_text(message)
    except WebSocketDisconnect:
        logger.info(
            f"WebSocket disconnected while sending update for package {package_id}"
        )
    except Exception as e:
        logger.error(f"Error sending package update for {package_id}: {str(e)}")
