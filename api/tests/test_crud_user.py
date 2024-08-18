from uuid import UUID

import pytest
from sqlalchemy.future import select

from app.crud.user import user as crud_user
from app.models.organization import Organization
from app.models.project import Project
from app.models.user import User, UserOrganization
from app.schemas.user import UserCreate


@pytest.mark.asyncio
async def test_create_user(async_session_test):
    # Prepare test data
    user_in = UserCreate(email="testuser@example.com", google_id="test_google_id")

    # Call the create_user method
    user = await crud_user.create_user(async_session_test, obj_in=user_in)

    # Assert user was created
    assert user.id is not None
    assert isinstance(user.id, UUID)
    assert user.email == "testuser@example.com"
    assert user.google_id == "test_google_id"

    # Check if default organization was created
    result = await async_session_test.execute(
        select(UserOrganization).where(UserOrganization.user_id == user.id)
    )
    user_org = result.scalars().first()
    result = await async_session_test.execute(
        select(Organization).where(Organization.id == user_org.organization_id)
    )
    org = result.scalars().first()
    assert org is not None
    assert org.name == "Default Organization"

    # Check if user-organization mapping was created
    result = await async_session_test.execute(
        select(UserOrganization).where(UserOrganization.user_id == user.id)
    )
    user_org = result.scalars().first()
    assert user_org is not None
    assert user_org.organization_id == org.id

    # Check if default project was created
    result = await async_session_test.execute(
        select(Project).where(Project.organization_id == org.id)
    )
    project = result.scalars().first()
    assert project is not None
    assert project.name == "Default Project"
    assert project.is_user_default == True

    # Verify the total number of users
    result = await async_session_test.execute(select(User))
    users = result.scalars().all()
    assert len(users) == 3  # 2 from seed data + 1 new user


@pytest.mark.asyncio
async def test_get_user_by_email(async_session_test):
    # First, create a user
    user_in = UserCreate(email="getuser@example.com", google_id="get_google_id")
    created_user = await crud_user.create_user(async_session_test, obj_in=user_in)

    # Now, try to get the user by email
    retrieved_user = await crud_user.get_by_email(
        async_session_test, email="getuser@example.com"
    )

    assert retrieved_user is not None
    assert retrieved_user.id == created_user.id
    assert retrieved_user.email == "getuser@example.com"
    assert retrieved_user.google_id == "get_google_id"


@pytest.mark.asyncio
async def test_get_user_default_org(async_session_test):
    test_user = await crud_user.get_by_email(
        async_session_test, email="user1@example.com"
    )
    assert test_user is not None

    org = await crud_user.get_default_organization(
        async_session_test, user_id=test_user.id
    )

    assert org is not None
    assert org.name == "Test Org 1"
