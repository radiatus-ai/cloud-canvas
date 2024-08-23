from api.infra.v1.endpoints import (
    connections,
    credentials,
    packages,
    project_packages,
    projects,
)
from fastapi import APIRouter, Depends

from app.core.dependencies import get_db_and_current_user

api_router = APIRouter(dependencies=[Depends(get_db_and_current_user)])
api_router.include_router(connections.router)
api_router.include_router(credentials.router)
api_router.include_router(packages.router)
api_router.include_router(project_packages.router)
api_router.include_router(projects.router)


router = APIRouter()


@router.get("/", dependencies=[])
async def root():
    return "healthy"
