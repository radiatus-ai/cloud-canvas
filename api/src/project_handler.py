from datetime import datetime
from typing import List, Optional

from fastapi import APIRouter, Body, HTTPException, Path
from gcs_service import (
    GCSService,  # Assuming you've put the GCSService in a separate file
)
from pydantic import BaseModel

router = APIRouter(
    prefix='/projects',
    tags=['projects'],
)

class ProjectBase(BaseModel):
    name: str
    description: Optional[str] = None

class Project(ProjectBase):
    id: str
    created_at: datetime
    updated_at: datetime

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None

PROJECT_FILE = 'projects.json'
gcs_service = GCSService()

@router.get("/", response_model=List[Project])
def list_projects():
    projects = gcs_service.read_json_file(PROJECT_FILE)
    if projects is None:
        return []
    return [Project(**project) for project in projects]

@router.post("/", response_model=Project)
def create_project(project: ProjectCreate):
    new_id = gcs_service.append_to_json_file(PROJECT_FILE, project.dict())
    if new_id:
        # Fetch the newly created project to get the correct timestamps
        projects = gcs_service.read_json_file(PROJECT_FILE)
        new_project = next((p for p in projects if p['id'] == new_id), None)
        if new_project:
            return Project(**new_project)
    raise HTTPException(status_code=500, detail="Failed to create project")

@router.put("/{project_id}", response_model=Project)
def update_project(project_id: str, project: ProjectBase):
    if gcs_service.update_item_in_json_file(PROJECT_FILE, project_id, project.dict()):
        # Fetch the updated project to get the correct timestamps
        projects = gcs_service.read_json_file(PROJECT_FILE)
        updated_project = next((p for p in projects if p['id'] == project_id), None)
        if updated_project:
            return Project(**updated_project)
    raise HTTPException(status_code=404, detail="Project not found")

@router.delete("/{project_id}")
def delete_project(project_id: str):
    if gcs_service.delete_item_from_json_file(PROJECT_FILE, project_id):
        return {"message": "Project deleted successfully"}
    raise HTTPException(status_code=404, detail="Project not found")

@router.patch("/{project_id}", response_model=Project)
async def update_project_partially(
    project_id: str = Path(..., title="The ID of the project to update"),
    project_update: ProjectUpdate = Body(..., title="Project update data")
):
    projects = gcs_service.read_json_file(PROJECT_FILE)
    project = None
    if projects:
        project = next((p for p in projects if p['id'] == project_id), None)
        # if project:
        #     return Project(**project)

    # Update only the fields that are provided
    update_data = project_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        project[field] = value

    # Update the 'updated_at' timestamp
    project['updated_at'] = datetime.now().isoformat()

    if gcs_service.update_item_in_json_file(PROJECT_FILE, project_id, project):
        return Project(**project)
    else:
        raise HTTPException(status_code=500, detail="Failed to update project")
