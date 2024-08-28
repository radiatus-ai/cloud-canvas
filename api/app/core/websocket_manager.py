from typing import Dict, Set

from fastapi import WebSocket
from pydantic import UUID4


class ConnectionManager:
    def __init__(self):
        # self.org_connections: Dict[UUID4, Set[WebSocket]] = {}
        self.project_connections: Dict[UUID4, Set[WebSocket]] = {}
        self.package_connections: Dict[UUID4, Set[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, project_id: UUID4, package_id: UUID4):
        if project_id not in self.project_connections:
            self.project_connections[project_id] = set()
        self.project_connections[project_id].add(websocket)

        if package_id not in self.package_connections:
            self.package_connections[package_id] = set()
        self.package_connections[package_id].add(websocket)

    def disconnect(self, websocket: WebSocket):
        # for org_connections in self.org_connections.values():
        #     org_connections.discard(websocket)
        for project_connections in self.project_connections.values():
            project_connections.discard(websocket)
        for package_connections in self.package_connections.values():
            package_connections.discard(websocket)

    # async def broadcast_to_org(self, org_id: UUID4, message: str):
    #     if org_id in self.org_connections:
    #         for connection in self.org_connections[org_id]:
    #             await connection.send_text(message)

    async def broadcast_to_project(self, project_id: UUID4, message: str):
        if project_id in self.project_connections:
            for connection in self.project_connections[project_id]:
                await connection.send_text(message)

    async def broadcast_to_package(self, package_id: UUID4, message: str):
        if package_id in self.package_connections:
            for connection in self.package_connections[package_id]:
                await connection.send_text(message)
