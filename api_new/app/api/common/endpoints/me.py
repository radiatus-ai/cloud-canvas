from fastapi import APIRouter, Request

from app.schemas.user import User

router = APIRouter(prefix="/me", tags=["me"])


@router.get("", response_model=User)
async def read_users_me(request: Request):
    return request.state.user
