import logging

import httpx
from fastapi import Depends, HTTPException, Request
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.core.config import settings

security = HTTPBearer()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def get_current_user(
    request: Request, credentials: HTTPAuthorizationCredentials = Depends(security)
):
    token = credentials.credentials
    logger.info(f"Token being sent to auth service: {token}")

    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{settings.AUTH_SERVICE_URL}/api/verify-token", json={"token": token}
        )

    if response.status_code != 200:
        logger.error(f"Auth service response: {response.status_code} - {response.text}")
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    user_data = response.json()["user"]
    request.state.user = user_data
    return user_data
