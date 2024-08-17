# from typing import List, Optional

# from sqlalchemy import and_
# from sqlalchemy.dialects.postgresql import UUID
# from sqlalchemy.ext.asyncio import AsyncSession
# from sqlalchemy.future import select

# from app.core.logger import get_logger
# from app.crud.base import CRUDBase
# from app.crud.organization import organization as crud_org
# from app.crud.project import project as crud_project
# from app.crud.user_organization import user_organization as crud_user_organization
# from platform.api.app.models.organization_old import Organization
# from app.models.user import User, UserOrganization
# from app.schemas.organization import OrganizationCreate
# from app.schemas.project import ProjectCreate
# from app.schemas.user import UserCreate, UserUpdate

# logger = get_logger(__name__)


# class CRUDUser(CRUDBase[User, UserCreate, UserUpdate]):
#     async def get_by_email(self, db: AsyncSession, email: str) -> Optional[User]:
#         statement = select(self.model).where(self.model.email == email)
#         result = await db.execute(statement)
#         return result.scalars().first()

#     async def get_by_google_id(
#         self, db: AsyncSession, google_id: str
#     ) -> Optional[User]:
#         statement = select(self.model).where(self.model.google_id == google_id)
#         result = await db.execute(statement)
#         return result.scalars().first()

#     async def get_user_organizations(
#         self, db: AsyncSession, user_id: UUID
#     ) -> List[Organization]:
#         query = (
#             select(Organization)
#             .join(UserOrganization, UserOrganization.organization_id == Organization.id)
#             .where(UserOrganization.user_id == user_id)
#         )
#         result = await db.execute(query)
#         return result.scalars().all()

#     async def get_default_organization(
#         self, db: AsyncSession, user_id: UUID
#     ) -> Optional[Organization]:
#         query = (
#             select(Organization)
#             .join(UserOrganization, UserOrganization.organization_id == Organization.id)
#             .where(
#                 and_(
#                     UserOrganization.user_id == user_id,
#                     Organization.is_user_default == True,
#                 )
#             )
#         )
#         result = await db.execute(query)
#         return result.scalars().first()

#     async def create_user(self, db: AsyncSession, *, obj_in: UserCreate) -> User:
#         # async with db.begin():
#         # Create user
#         # user = self.model(**obj_in.model_dump())
#         # db.add(user)
#         # await db.flush()
#         user = await super().create(db, obj_in=obj_in, auto_commit=False)

#         # Create organization
#         org = await crud_org.create(
#             db,
#             obj_in=OrganizationCreate(
#                 name="Default Organization", is_user_default=True
#             ),
#             auto_commit=False,
#         )

#         # await db.refresh(user)
#         # await db.refresh(org)
#         logger.info("NEW USER\n" * 20)
#         logger.info(user)
#         logger.info(user.id)
#         logger.info(org.id)
#         user_org = await crud_user_organization.create_user_organization(
#             db, user_id=user.id, organization_id=org.id, auto_commit=False
#         )
#         logger.info("POST USER\n" * 20)
#         logger.info(f"User-Org Mapping: {user_org}")

#         # await db.flush()
#         try:
#             project = await crud_project.create_project(
#                 db,
#                 obj_in=ProjectCreate(
#                     name="Default Project", is_user_default=True, organization_id=org.id
#                 ),
#                 auto_commit=False,
#             )
#             logger.info(f"Default Project: {project}")
#         except Exception as err:
#             logger.info("ERROR\n" * 20)
#             logger.error(f"the error {err}")
#             raise

#         await db.commit()
#         await db.flush()
#         await db.refresh(user)
#         return user


# user = CRUDUser(User)
