from datetime import datetime

from fastapi import Depends, Header, HTTPException, Security, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from google.auth.transport import requests
from google.oauth2 import id_token
from opentelemetry import trace
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.core.config import settings
from app.core.jwt import verify_custom_jwt
from app.crud.user import user as crud_user
from app.db.session import get_db
from app.models.api_token import APIToken

security = HTTPBearer(auto_error=False)


async def get_current_user(
    db: AsyncSession = Depends(get_db),
    credentials: HTTPAuthorizationCredentials = Security(security),
    x_ada_token: str = Header(None, alias="x-ada-token"),
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    user = None
    print("NONE" * 20)
    print(x_ada_token)

    if x_ada_token:
        try:
            result = await db.execute(
                select(APIToken).where(APIToken.token == x_ada_token)
            )
            token = result.scalar_one_or_none()
            print("TOKEN FROM DB")
            print(token)
            if not token:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid API key",
                )
            # Update last used timestamp
            token.last_used_at = datetime.utcnow()
            user = await crud_user.get(db, id=token.user_id)
            # todo: add org from token.organization_id
            return user
        except Exception as err:
            print("ERRR" * 20)
            print(err)
            pass

    # If no x-ada-token, proceed with JWT Google token validation
    if not credentials:
        raise credentials_exception

    token = credentials.credentials

    # Usage in downstream service, for the auth middleware
    try:
        decoded_payload = verify_custom_jwt(token, settings.SECRET_KEY)
        # Now you can access both the original Google token info and your custom data
        google_id = decoded_payload.get("sub")  # Google's user ID
        decoded_payload.get("organization_id")
        user = await crud_user.get_by_google_id(db, google_id=google_id)
        # Proceed with your logic
    except ValueError as e:
        # Handle invalid or expired token
        print(f"Token verification failed: {str(e)}")
        # this is getting called in a rare case, but it should only be handled in login!
        idinfo = id_token.verify_oauth2_token(
            token, requests.Request(), settings.GOOGLE_CLIENT_ID
        )

        google_id = idinfo["sub"]
        email = idinfo["email"]
        current_span = trace.get_current_span()

        # Add attributes to the current span
        current_span.set_attribute("ada.email", email)

        # Check if the user exists, if not, create a new one
        user = await crud_user.get_by_google_id(db, google_id=google_id)

    # user = await crud_user.get(db, id=token_data.user_id)
    if user is None:
        raise credentials_exception

    return user


########################################################################
# spare code for when we implement RBAC and scopes, don't delete this ##
# async def check_user_project_access(
#     user: User, project_id: int, organization_id: int, db: AsyncSession
# ) -> bool:
#     stmt = (
#         select(Project)
#         .where(
#             (Project.id == project_id)
#             & (Project.organization_id == organization_id)
#             & (Organization.id == organization_id)
#             & (User.id == user.id)
#         )
#         .join(Organization)
#         .join(Organization.users)
#     )
#     result = await db.execute(stmt)
#     project = result.scalar_one_or_none()
#     return project is not None


# Decorator for permission checking
# def require_permissions(required_scopes: list[str]):
#     def decorator(func):
#         async def wrapper(
#             current_user: User = Depends(get_current_user), *args, **kwargs
#         ):
#             user_scopes = current_user.scopes
#             if not all(scope in user_scopes for scope in required_scopes):
#                 raise HTTPException(
#                     status_code=status.HTTP_403_FORBIDDEN,
#                     detail="Insufficient permissions",
#                 )
#             return await func(current_user, *args, **kwargs)

#         return wrapper

#     return decorator
########################################################################
