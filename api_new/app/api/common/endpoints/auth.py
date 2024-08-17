import httpx
from fastapi import APIRouter, Body, HTTPException, status

from app.core.config import settings

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login")
async def login_google(body: dict = Body(...)):
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{settings.AUTH_SERVICE_URL}/login/google", json={"token": body["token"]}
        )

    if response.status_code != 200:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token or unauthorized email",
        )

    return response.json()
