from typing import Optional

from config import config
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from google.auth.transport import requests
from google.oauth2 import id_token
from pydantic import BaseModel

router = APIRouter(prefix="/users", tags=["users"])

security = HTTPBearer()

GOOGLE_CLIENT_ID = config.GOOGLE_CLIENT_ID


class UserInfo(BaseModel):
    email: str
    name: Optional[str] = None
    avatar: Optional[str] = None


def get_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    return credentials.credentials


@router.get("/me", response_model=UserInfo)
async def get_user_info(token: str = Depends(get_token)):
    try:
        # Verify the token using google-auth library
        idinfo = id_token.verify_oauth2_token(
            token, requests.Request(), GOOGLE_CLIENT_ID
        )

        # Check if the token is issued by Google
        if idinfo["iss"] not in ["accounts.google.com", "https://accounts.google.com"]:
            raise ValueError("Wrong issuer.")

        # Extract user information from the verified token
        email = idinfo.get("email")
        name = idinfo.get("name")
        picture = idinfo.get("picture")

        if not email:
            raise HTTPException(status_code=400, detail="Email not found in token")

        return UserInfo(email=email, name=name, avatar=picture)
    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid token")


# Add this router to your main FastAPI app
# from user_router import router as user_router
# app.include_router(user_router)
