# # app/crud/user_organization.py

# from typing import List

# from sqlalchemy.dialects.postgresql import UUID
# from sqlalchemy.ext.asyncio import AsyncSession
# from sqlalchemy.future import select

# from app.crud.base import CRUDBase
# from app.models.user import UserOrganization
# from app.schemas.user_organization import UserOrganizationCreate, UserOrganizationUpdate


# class CRUDUserOrganization(
#     CRUDBase[UserOrganization, UserOrganizationCreate, UserOrganizationUpdate]
# ):
#     async def get_by_user_and_org(
#         self, db: AsyncSession, *, user_id: UUID, organization_id: UUID
#     ) -> UserOrganization | None:
#         statement = select(self.model).where(
#             (self.model.user_id == user_id)
#             & (self.model.organization_id == organization_id)
#         )
#         result = await db.execute(statement)
#         return result.scalar_one_or_none()

#     async def get_by_user(
#         self, db: AsyncSession, *, user_id: UUID
#     ) -> List[UserOrganization]:
#         statement = select(self.model).where(self.model.user_id == user_id)
#         result = await db.execute(statement)
#         return result.scalars().all()

#     async def get_by_organization(
#         self, db: AsyncSession, *, organization_id: UUID
#     ) -> List[UserOrganization]:
#         statement = select(self.model).where(
#             self.model.organization_id == organization_id
#         )
#         result = await db.execute(statement)
#         return result.scalars().all()

#     async def create_user_organization(
#         self,
#         db: AsyncSession,
#         *,
#         user_id: UUID,
#         organization_id: UUID,
#         auto_commit: bool = False,
#     ) -> UserOrganization:
#         db_obj = UserOrganization(user_id=user_id, organization_id=organization_id)
#         db.add(db_obj)
#         await db.flush()
#         # await db.commit()
#         await db.refresh(db_obj)
#         if auto_commit:
#             await db.commit()
#         return db_obj

#     async def delete_user_organization(
#         self,
#         db: AsyncSession,
#         *,
#         user_id: UUID,
#         organization_id: UUID,
#         auto_commit: bool = False,
#     ) -> UserOrganization | None:
#         db_obj = await self.get_by_user_and_org(
#             db, user_id=user_id, organization_id=organization_id
#         )
#         if db_obj:
#             await db.delete(db_obj)
#             await db.flush()
#             if auto_commit:
#                 await db.commit()
#         return db_obj


# user_organization = CRUDUserOrganization(UserOrganization)
