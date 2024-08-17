from typing import List

from fastapi import APIRouter, Depends, HTTPException
from pydantic import UUID4

from app.core.dependencies import get_db_and_current_user
from app.crud import project as crud_project
from app.schemas.project import Project, ProjectCreate, ProjectUpdate

router = APIRouter()


# Projects
@router.get("/projects/", response_model=List[Project])
async def list_projects(
    skip: int = 0, limit: int = 100, deps: dict = Depends(get_db_and_current_user)
):
    db = deps["db"]
    current_user = deps["current_user"]
    return await crud_project.list_projects_for_user(
        db, user=current_user, skip=skip, limit=limit
    )


@router.post("/projects/", response_model=Project)
async def create_project(
    project: ProjectCreate, deps: dict = Depends(get_db_and_current_user)
):
    db = deps["db"]
    return await crud_project.create_project(db, obj_in=project)


@router.patch("/projects/{project_id}", response_model=Project)
async def update_project(
    project_id: UUID4,
    project: ProjectUpdate,
    deps: dict = Depends(get_db_and_current_user),
):
    db = deps["db"]
    existing_project = await crud_project.get_project(db, project_id)
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
    project = await crud_project.get_project(db, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return await crud_project.delete_project(db, id=project_id)
