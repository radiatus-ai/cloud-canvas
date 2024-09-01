from fastapi import (
    APIRouter,
    Depends,
    Path,
    WebSocket,
)
from pydantic import UUID4

from app.core.dependencies import (
    get_db_without_trace,
    get_websocket_manager,
)
from app.core.logger import get_logger
from app.core.websocket_manager import ConnectionManager

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
    try:
        print("hello")
        # await websocket_manager.connect(websocket, project_id, package_id)

        # while True:
        #     try:
        #         data = await websocket.receive_text()
        #         message = json.loads(data)
        #         logger.info(f"Received message for package {package_id}: {message}")

        #         db = deps["db"]
        #         package = await crud_project_package.get_package(
        #             db, id=package_id, project_id=project_id
        #         )

        #         if message.get("type") in [
        #             "request_update",
        #             "package_update",
        #             "request_initial",
        #         ]:
        #             await send_package_update(
        #                 websocket,
        #                 package_id,
        #                 package.deploy_status.value if package else "UNKNOWN",
        #             )
        #         else:
        #             await websocket.send_text(
        #                 json.dumps({"type": "error", "message": "Invalid message type"})
        #             )
        #     except WebSocketDisconnect:
        #         logger.info(f"WebSocket disconnected for package {package_id}")
        #         break
        #     except json.JSONDecodeError:
        #         logger.error(f"Received invalid JSON for package {package_id}: {data}")
        #         await websocket.send_text(
        #             json.dumps({"type": "error", "message": "Invalid JSON received"})
        #         )
        #     except Exception as e:
        #         logger.error(
        #             f"Error processing message for package {package_id}: {str(e)}"
        #         )
        #         await websocket.send_text(
        #             json.dumps({"type": "error", "message": "Internal server error"})
        #         )
    finally:
        websocket_manager.disconnect(websocket)
