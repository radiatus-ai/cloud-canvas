import json
from typing import Dict, Set

from fastapi import WebSocket
from pydantic import UUID4

from app.core.logger import get_logger

logger = get_logger(__name__)


class ConnectionManager:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(ConnectionManager, cls).__new__(cls)
            cls._instance.package_connections: Dict[UUID4, Set[WebSocket]] = {}
        return cls._instance

    async def connect(self, websocket: WebSocket, project_id: UUID4, package_id: UUID4):
        if package_id not in self.package_connections:
            self.package_connections[package_id] = set()
        self.package_connections[package_id].add(websocket)
        logger.info(
            f"New WebSocket connection added for package {package_id}. Total connections: {len(self.package_connections[package_id])}"
        )

    def disconnect(self, websocket: WebSocket):
        for package_id, connections in self.package_connections.items():
            if websocket in connections:
                connections.remove(websocket)
                logger.info(
                    f"WebSocket disconnected for package {package_id}. Remaining connections: {len(connections)}"
                )

    async def broadcast_package_update(self, package_id: UUID4, package_data: dict):
        message = json.dumps(
            {"type": "package_update", "data": package_data}, default=str
        )
        logger.info(f"Broadcasting message: {message}")
        await self.broadcast_to_package(package_id, message)

    async def broadcast_to_package(self, package_id: UUID4, message: str):
        logger.info(f"Attempting to broadcast to package {package_id}")
        if package_id in self.package_connections:
            connections = self.package_connections[package_id]
            logger.info(
                f"Found {len(connections)} connections for package {package_id}"
            )
            active_connections = set()
            for connection in connections:
                try:
                    await connection.send_text(message)
                    logger.info(
                        f"Successfully sent message to a connection for package {package_id}"
                    )
                    active_connections.add(connection)
                except Exception as e:
                    logger.error(
                        f"Failed to send message to a connection for package {package_id}: {str(e)}"
                    )
            self.package_connections[package_id] = active_connections
            logger.info(
                f"Updated connections for package {package_id}. Active connections: {len(active_connections)}"
            )
        else:
            logger.warning(f"No connections found for package {package_id}")

    def get_connection_count(self, package_id: UUID4) -> int:
        return len(self.package_connections.get(package_id, set()))

    def log_all_connections(self):
        for package_id, connections in self.package_connections.items():
            logger.info(f"Package {package_id}: {len(connections)} connections")
