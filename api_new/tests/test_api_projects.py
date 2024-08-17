from platform.api.app.models.organization_old import Organization

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

# @pytest.mark.asyncio
# async def test_database_seeded(async_session_test: AsyncSession):
#     # Check organizations
#     result = await async_session_test.execute(select(Organization))
#     organizations = result.scalars().all()
#     assert len(organizations) == 2, "Expected 2 organizations"

#     # Check users
#     result = await async_session_test.execute(select(User))
#     users = result.scalars().all()
#     assert len(users) == 2, "Expected 2 users"

#     # Check projects
#     result = await async_session_test.execute(select(Project))
#     projects = result.scalars().all()
#     assert len(projects) == 2, "Expected 2 projects"

#     # Check API tokens
#     result = await async_session_test.execute(select(APIToken))
#     tokens = result.scalars().all()
#     assert len(tokens) == 1, "Expected 1 API token"


@pytest.mark.asyncio
async def test_create_project(client: TestClient, async_session_test: AsyncSession):
    result = await async_session_test.execute(select(Organization))
    organizations = result.scalars().all()
    org = organizations[0]
    assert org.name == "Test Org 1"
    project_data = {
        "name": "Newest project",
        "organization_id": f"{org.id}",
        "is_user_default": False,
    }
    response = client.post(
        "/ada/v1/projects", headers={"x-ada-token": "foobar"}, json=project_data
    )
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == project_data["name"]
    assert "id" in data


@pytest.mark.asyncio
async def test_list_projects(client: TestClient):
    response = client.get("/ada/v1/projects", headers={"x-ada-token": "foobar"})
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
