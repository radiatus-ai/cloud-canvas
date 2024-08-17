# from typing import Optional

# from fastapi import APIRouter, Body, Depends, HTTPException, status
# from google.auth.transport import requests
# from google.oauth2 import id_token
# from opentelemetry import trace
# from pydantic import BaseModel
# from sqlalchemy.ext.asyncio import AsyncSession
# from sqlalchemy.future import select

# from app.core.config import settings
# from app.core.jwt import create_custom_jwt
# from app.core.logger import get_logger
# from app.crud.user import user as crud_user
# from app.db.session import get_db
# from app.models import (
#     Organization,
#     User,
# )
# from app.schemas.user import UserCreate

# logger = get_logger(__name__)

# router = APIRouter(
#     prefix="/auth",
#     tags=["auth"],
# )


# class PostQuery(BaseModel):
#     token: str
#     organization_id: Optional[int] = None


# # okay new plan.
# # most of the old plan
# # create the org and project
# # but don't create the chat
# # create a new component that's the chat page, just the prompt page but when submitted
# # a new chat gets added to the default project
# # and a new message gets sent
# # chats have fixed providers and models
# # messages don't need the model, I think


# # cli uses api token
# # api token currently is attached to user
# # but i might attach them to projects like gcp
# # todo the identity route
# # api tokens can be at the user or org for now
# @router.post("/login")
# async def login_google(body: PostQuery = Body(...), db: AsyncSession = Depends(get_db)):
#     logger.info(f"Logging a user into the org {body.organization_id}")
#     # if body.organization_id == 0:
#     #     raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="todo")
#     try:
#         # try the custom token first, whats stored locally. could be used maybe
#         # try:
#         #     print("")
#         #     # decoded_payload = verify_custom_jwt(body.token, settings.SECRET_KEY)
#         #     # # Now you can access both the original Google token info and your custom data
#         #     # google_id = decoded_payload.get("sub")  # Google's user ID
#         #     # org_id = decoded_payload.get("organization_id")
#         #     # print("trying" * 30)
#         #     # user = await crud_user.get_by_google_id(db, google_id=google_id)
#         #     # custom_jwt = create_custom_jwt(
#         #     #     body.token, {"organization_id": org_id}, settings.SECRET_KEY
#         #     # )
#         #     # return {"user": user, "token": custom_jwt}
#         #     # potentially just return the token
#         # except jose.exceptions.JWTError:
#         #     pass

#         # Verify the token
#         idinfo = id_token.verify_oauth2_token(
#             body.token, requests.Request(), settings.GOOGLE_CLIENT_ID
#         )

#         google_id = idinfo["sub"]
#         email = idinfo["email"]
#         current_span = trace.get_current_span()

#         # Add attributes to the current span
#         current_span.set_attribute("ada.email", email)

#         # Check if the user exists, if not, create a new one
#         user = await crud_user.get_by_google_id(db, google_id=google_id)
#         if not user:
#             user_in = UserCreate(email=email, google_id=google_id)
#             user = await crud_user.create_user(db, obj_in=user_in)
#             # todo: need to work on this flow more
#             # since we create an org, we skip the rest for now
#             default_org = await crud_user.get_default_organization(db, user_id=user.id)
#             custom_jwt = create_custom_jwt(
#                 body.token,
#                 {"organization_id": f"{default_org.id}"},
#                 settings.SECRET_KEY,
#             )
#             return {"user": user, "token": custom_jwt}

#         org_id = None
#         if not body.organization_id:
#             # find orgs user is in, grab default org
#             # set on user model, return
#             print("getting default org" * 20)
#             default_org = await crud_user.get_default_organization(db, user_id=user.id)
#             org_id = default_org.id

#             # return user
#         else:
#             print("checkking" * 20)
#             # check if user belongs to organization
#             stmt = (
#                 select(Organization)
#                 .where(Organization.id == body.organization_id)
#                 .join(Organization.users)
#                 .where(User.id == user.id)
#             )
#             result = await db.execute(stmt)
#             org = result.scalar_one_or_none()
#             print("done checking" * 20)
#             org_id = body.organization_id

#         custom_jwt = create_custom_jwt(
#             body.token, {"organization_id": f"{org_id}"}, settings.SECRET_KEY
#         )

#         if not org_id:
#             raise HTTPException(
#                 status_code=status.HTTP_401_UNAUTHORIZED,
#                 detail="user does not belong to organization",
#             )

#         # user.organization_id = body.organization_id
#         return {"user": user, "token": custom_jwt}
#     except ValueError as err:
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token"
#         ) from err


# @router.post("/create")
# async def create_user(db: AsyncSession = Depends(get_db)):
#     user = await crud_user.create_user(
#         db, obj_in=UserCreate(email="test332@gmail.com", google_id="foobarr2332")
#     )
#     return user
