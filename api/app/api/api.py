from api.common.endpoints import (
    auth,
    me,
)
from api.infra.v1.endpoints import (
    canvas_ws,
    connections,
    credentials,
    packages,
    project_packages,
    project_packages_ws,
    projects,
)
from api.provisioner.v1.endpoints import (
    project_packages as provisioner_project_packages,
)

# tokens,
from fastapi import APIRouter, Depends

from app.core.dependencies import get_db_and_current_user

api_router = APIRouter(dependencies=[Depends(get_db_and_current_user)])
api_router.include_router(connections.router)
api_router.include_router(credentials.router)
api_router.include_router(packages.router)
api_router.include_router(project_packages.router)
api_router.include_router(projects.router)
api_router.include_router(auth.router)
api_router.include_router(me.router)
# api_router.include_router(tokens.router)


base_router = APIRouter()


@base_router.get("/", dependencies=[])
async def root():
    return "healthy"


# todo: add token auth that's just for the provisioner
provisioner_router = APIRouter(prefix="/provisioner", tags=["provisioner"])
provisioner_router.include_router(provisioner_project_packages.router)

# todo: add to api router for auth
socket_router = APIRouter()
socket_router.include_router(project_packages_ws.router)
socket_router.include_router(canvas_ws.router)
