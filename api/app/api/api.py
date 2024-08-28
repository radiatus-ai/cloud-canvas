from api.infra.v1.endpoints import (
    connections,
    credentials,
    packages,
    project_packages,
    projects,
)
from api.provisioner.v1.endpoints import (
    project_packages as provisioner_project_packages,
)
from fastapi import APIRouter, Depends

from app.core.dependencies import get_db_and_current_user

api_router = APIRouter(dependencies=[Depends(get_db_and_current_user)])
api_router.include_router(connections.router)
api_router.include_router(credentials.router)
api_router.include_router(packages.router)
api_router.include_router(project_packages.router)
api_router.include_router(projects.router)


base_router = APIRouter()


@base_router.get("/", dependencies=[])
async def root():
    return "healthy"


# todo: add token auth that's just for the provisioner
provisioner_router = APIRouter(prefix="/provisioner", tags=["provisioner"])
provisioner_router.include_router(provisioner_project_packages.router)

socket_router = APIRouter()
socket_router.include_router(project_packages.socket_router)
