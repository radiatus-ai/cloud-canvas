from typing import List

from fastapi import APIRouter, Depends, HTTPException
from pydantic import UUID4

from app.core.dependencies import get_db_and_current_user
from app.crud.connection import connection as crud_connection
from app.schemas.connection import Connection, ConnectionCreate

router = APIRouter()


@router.get("/projects/{project_id}/connections/", response_model=List[Connection])
async def list_connections(
    project_id: UUID4, deps: dict = Depends(get_db_and_current_user)
):
    db = deps["db"]
    return await crud_connection.get_connections_by_project(db, project_id=project_id)


@router.post("/projects/{project_id}/connections/", response_model=Connection)
async def create_connection(
    project_id: UUID4,
    connection: ConnectionCreate,
    deps: dict = Depends(get_db_and_current_user),
):
    db = deps["db"]
    return await crud_connection.create_connection(
        db, obj_in=connection, project_id=project_id
    )


@router.delete(
    "/projects/{project_id}/connections/{connection_id}", response_model=Connection
)
async def delete_connection(
    project_id: UUID4,
    connection_id: UUID4,
    deps: dict = Depends(get_db_and_current_user),
):
    db = deps["db"]
    connection = await crud_connection.get_connection(db, id=connection_id)
    if not connection:
        raise HTTPException(status_code=404, detail="Connection not found")
    return await crud_connection.delete_connection(db, id=connection_id)
