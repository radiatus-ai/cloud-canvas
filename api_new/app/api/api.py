from fastapi import APIRouter

from app.api.ada.v1.api import api_router as ada_v1
from app.api.common.api import api_router as me_router

# Import other domain-specific API modules here

api_router = APIRouter()

# Include the /me endpoint
api_router.include_router(me_router)

# Include domain-specific routers
api_router.include_router(ada_v1, prefix="/ada/v1")
# Include other domain-specific routers here
