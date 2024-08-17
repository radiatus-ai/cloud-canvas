from fastapi import APIRouter, WebSocket
from fastapi.websockets import WebSocketDisconnect

router = APIRouter(
    prefix="/live",
    tags=["live"],
)


@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            # Wait for any message from the client
            data = await websocket.receive_text()
            # Echo the message back
            await websocket.send_text(f"Message received: {data}")
    except WebSocketDisconnect:
        print("Client disconnected")


@router.get("/send_message/{message}")
async def send_message(message: str):
    # In a real application, you'd manage WebSocket connections
    # This is a simplified example
    return {"message": "Message sent (simulated)"}
