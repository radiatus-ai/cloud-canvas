from datetime import datetime

import jose
from google.auth.transport import requests
from google.oauth2 import id_token
from jose import jwt

from app.core.config import settings
from app.core.logger import get_logger

logger = get_logger(__name__)

# todo: maybe use this as a model for the custom jwt
# class TokenData(BaseModel):
#     user_id: int
#     email: str
#     organization_id: int
#     scopes: List[str] = []


def verify_custom_jwt(token, secret_key):
    try:
        payload = jwt.decode(
            token,
            secret_key,
            algorithms=[settings.ALGORITHM],
            audience="your_api_audience",
        )
        return payload
    except jwt.ExpiredSignatureError as err:
        raise ValueError("Token has expired") from err
    except jose.exceptions.JWTError as err:
        logger.info(token)
        raise ValueError("Token algo not right %v", token) from err


def create_custom_jwt(google_id_token, additional_data, secret_key):
    logger.debug(google_id_token)
    # First, verify the Google ID token
    try:
        idinfo = id_token.verify_oauth2_token(
            google_id_token,
            requests.Request(),
            "368747471698-m570pnvdpes6cncrupq9r2vvjp20951m.apps.googleusercontent.com",
        )
    except ValueError as err:
        raise ValueError("Invalid Google ID token") from err
    if idinfo["iss"] not in ["accounts.google.com", "https://accounts.google.com"]:
        raise ValueError("Wrong issuer.")
    logger.info("valid google token")

    # Combine verified Google token info with additional data
    payload = {**idinfo, **additional_data}

    # Add standard JWT claims
    payload.update(
        {
            "iat": int(datetime.utcnow().timestamp()),
            "exp": int(datetime.utcnow().timestamp()) + 3600,  # 1 hour expiration
            "aud": "your_api_audience",
        }
    )

    # Create the JWT
    return jwt.encode(payload, secret_key, algorithm=settings.ALGORITHM)
