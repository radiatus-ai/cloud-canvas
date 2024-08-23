# from fastapi import APIRouter

# from app.api.infra.v1.api import api_router as canvas_v1
# from app.api.common.api import api_router as me_router

# # Import other domain-specific API modules here

# api_router = APIRouter()

# # Include the /me endpoint
# api_router.include_router(me_router)

# # Include domain-specific routers
# api_router.include_router(canvas_v1, prefix="/canvas/v1")
# # Include other domain-specific routers here


from api.infra.v1.endpoints import connections, packages, project_packages, projects
from fastapi import APIRouter, Depends

from app.core.dependencies import get_db_and_current_user

api_router = APIRouter(dependencies=[Depends(get_db_and_current_user)])
api_router.include_router(connections.router)
api_router.include_router(packages.router)
api_router.include_router(project_packages.router)
api_router.include_router(projects.router)


router = APIRouter()


@router.get("/", dependencies=[])
async def root():
    return "healthy"
