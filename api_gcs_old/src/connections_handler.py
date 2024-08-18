from datetime import datetime
from typing import List

from fastapi import APIRouter, HTTPException, Path
from gcs_service import (
    GCSService,
)
from pydantic import BaseModel

router = APIRouter(
    prefix="/projects/{project_id}/connections",
    tags=["project connections"],
)

gcs_service = GCSService()


class ConnectionData(BaseModel):
    connectionType: str
    sourceHandle: str
    targetHandle: str


class ConnectionBase(BaseModel):
    source: str
    target: str
    sourceHandle: str
    targetHandle: str
    type: str = "custom"
    data: ConnectionData


class Connection(ConnectionBase):
    id: str
    created_at: datetime
    updated_at: datetime


class ConnectionCreate(BaseModel):
    source: str
    target: str
    sourceHandle: str
    targetHandle: str
    data: ConnectionData


def get_connections_file_name(project_id: str) -> str:
    return f"project/{project_id}/connections.json"


@router.get("/", response_model=List[Connection])
async def list_connections(project_id: str = Path(..., title="The ID of the project")):
    file_name = get_connections_file_name(project_id)
    connections = gcs_service.read_json_file(file_name)
    if connections is None:
        return []
    return [Connection(**connection) for connection in connections]


@router.post("/", response_model=Connection)
async def create_connection(
    connection: ConnectionCreate,
    project_id: str = Path(..., title="The ID of the project"),
):
    file_name = get_connections_file_name(project_id)
    new_id = gcs_service.append_to_json_file(file_name, connection.dict())
    if new_id:
        # Fetch the newly created project to get the correct timestamps
        connections = gcs_service.read_json_file(file_name)
        new_connection = next((p for p in connections if p["id"] == new_id), None)
        if new_connection:
            return Connection(**new_connection)
    raise HTTPException(status_code=500, detail="Failed to create project")


@router.get("/{connection_id}", response_model=Connection)
async def get_connection(
    connection_id: str, project_id: str = Path(..., title="The ID of the project")
):
    file_name = get_connections_file_name(project_id)
    connections = gcs_service.read_json_file(file_name)
    if connections:
        connection = next((c for c in connections if c["id"] == connection_id), None)
        if connection:
            return Connection(**connection)
    raise HTTPException(status_code=404, detail="Connection not found")


@router.put("/{connection_id}", response_model=Connection)
async def update_connection(
    connection_id: str,
    # todo: update
    connection: ConnectionCreate,
    project_id: str = Path(..., title="The ID of the project"),
):
    file_name = get_connections_file_name(project_id)
    updated_connection = Connection(id=connection_id, **connection.dict())
    if gcs_service.update_item_in_json_file(
        file_name, connection_id, updated_connection.dict()
    ):
        return updated_connection
    raise HTTPException(status_code=404, detail="Connection not found")


@router.delete("/{connection_id}")
async def delete_connection(
    connection_id: str, project_id: str = Path(..., title="The ID of the project")
):
    file_name = get_connections_file_name(project_id)
    if gcs_service.delete_item_from_json_file(file_name, connection_id):
        return {"message": "Connection deleted successfully"}
    raise HTTPException(status_code=404, detail="Connection not found")
