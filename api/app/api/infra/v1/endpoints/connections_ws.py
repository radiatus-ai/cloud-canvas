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
from app.crud.connection import connection as crud_connection

logger = get_logger(__name__)

router = APIRouter(
    prefix="/projects/{project_id}/connections", tags=["project", "connections"]
)


@router.websocket("/ws")
async def websocket_endpoint(
    websocket: WebSocket,
    project_id: UUID4 = Path(..., description="The ID of the project"),
    deps: dict = Depends(get_db_without_trace),
    websocket_manager: ConnectionManager = Depends(get_websocket_manager),
):
    await websocket.accept()
    logger.info(f"WebSocket connection accepted for project connections {project_id}")
    try:
        await websocket_manager.connect(websocket, project_id, "connections")

        while True:
            try:
                data = await websocket.receive_text()
                message = json.loads(data)
                logger.info(
                    f"Received message for project connections {project_id}: {message}"
                )

                db = deps["db"]
                connections = await crud_connection.get_connections_by_project(
                    db, project_id=project_id
                )

                if message.get("type") in [
                    "request_update",
                    "connection_update",
                    "request_initial",
                ]:
                    await send_connections_update(
                        websocket,
                        project_id,
                        connections,
                    )
                else:
                    await websocket.send_text(
                        json.dumps({"type": "error", "message": "Invalid message type"})
                    )
            except WebSocketDisconnect:
                logger.info(
                    f"WebSocket disconnected for project connections {project_id}"
                )
                break
            except json.JSONDecodeError:
                logger.error(
                    f"Received invalid JSON for project connections {project_id}: {data}"
                )
                await websocket.send_text(
                    json.dumps({"type": "error", "message": "Invalid JSON received"})
                )
            except Exception as e:
                logger.error(
                    f"Error processing message for project connections {project_id}: {str(e)}"
                )
                await websocket.send_text(
                    json.dumps({"type": "error", "message": "Internal server error"})
                )
    finally:
        websocket_manager.disconnect(websocket)
        logger.info(f"WebSocket connection closed for project connections {project_id}")


async def send_connections_update(
    websocket: WebSocket, project_id: UUID4, connections: list
):
    try:
        message = json.dumps(
            {
                "type": "connections_update",
                "data": {
                    "project_id": str(project_id),
                    "connections": [conn.dict() for conn in connections],
                },
            }
        )
        logger.info(f"Sending connections update for project {project_id}: {message}")
        await websocket.send_text(message)
    except WebSocketDisconnect:
        logger.info(
            f"WebSocket disconnected while sending update for project connections {project_id}"
        )
    except Exception as e:
        logger.error(
            f"Error sending connections update for project {project_id}: {str(e)}"
        )
