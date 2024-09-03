from typing import List

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Query,
    WebSocket,
    WebSocketDisconnect,
)
from pydantic import UUID4

from app.core.dependencies import (
    get_db_and_current_user,
)
from app.core.logger import get_logger
from app.core.websocket_manager import ConnectionManager
from app.crud.project import project as crud_project
from app.schemas.project import Project, ProjectCreate, ProjectUpdate

logger = get_logger(__name__)

logger = get_logger(__name__)

router = APIRouter()

# Add this at the module level
connection_manager = ConnectionManager()


# Projects
@router.get("/projects/", response_model=List[Project])
async def list_projects(
    skip: int = 0, limit: int = 100, deps: dict = Depends(get_db_and_current_user)
):
    db = deps["db"]
    organization = deps["organization_id"]
    organization_id = organization.id
    projects = await crud_project.list_projects_for_organization(
        db, skip=skip, limit=limit, organization_id=organization_id
    )
    return projects


# @router.post("/projects/", response_model=Project)
@router.post("/projects/")
async def create_project(
    project: ProjectCreate, deps: dict = Depends(get_db_and_current_user)
):
    db = deps["db"]
    organization = deps["organization_id"]
    organization_id = organization.id
    new_prj = ProjectCreate(name=project.name, organization_id=organization_id)
    prj = await crud_project.create_project(db, obj_in=new_prj)
    # a little weird we have to do this. def unique to the async setup we have
    # we may only have to do this in create but I'm not 100% sure yet
    await db.refresh(prj)
    # todo: add websocket for projects
    # await connection_manager.broadcast(f"New project created: {prj.name}")

    return prj


@router.patch("/projects/{project_id}", response_model=Project)
async def update_project(
    project_id: UUID4,
    project: ProjectUpdate,
    deps: dict = Depends(get_db_and_current_user),
):
    db = deps["db"]
    existing_project = await crud_project.get(db, project_id)
    if not existing_project:
        raise HTTPException(status_code=404, detail="Project not found")
    return await crud_project.update_project(
        db, db_obj=existing_project, obj_in=project
    )


@router.delete("/projects/{project_id}", response_model=Project)
async def delete_project(
    project_id: UUID4, deps: dict = Depends(get_db_and_current_user)
):
    db = deps["db"]
    project = await crud_project.get(db, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return await crud_project.delete_project(db, id=project_id)


@router.get("/projects/{project_id}", response_model=Project)
async def get_project(project_id: UUID4, deps: dict = Depends(get_db_and_current_user)):
    db = deps["db"]
    project = await crud_project.get(db, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


@router.websocket("/ws/projects")
async def websocket_endpoint(
    websocket: WebSocket, org_id: UUID4 = Query(...), project_id: UUID4 = Query(None)
):
    await connection_manager.connect(websocket, org_id, project_id)
    try:
        while True:
            # Wait for any message from the client (optional)
            await websocket.receive_text()
    except WebSocketDisconnect:
        connection_manager.disconnect(websocket)
