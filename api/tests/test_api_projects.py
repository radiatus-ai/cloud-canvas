from uuid import UUID

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.models.api_token import APIToken
from app.models.organization_reference import OrganizationReference
from app.models.project import Project


@pytest.mark.asyncio
async def test_create_project(client: TestClient, async_session_test: AsyncSession):
    # First, ensure we have an OrganizationReference in the database
    org_ref = OrganizationReference(
        id=UUID("2320a0d6-8cbb-4727-8f33-6573d017d980"), name="Test Org 1"
    )
    async_session_test.add(org_ref)
    await async_session_test.commit()

    project_data = {
        "name": "Newest project",
        "organization_id": str(org_ref.id),
        "is_user_default": False,
    }
    response = client.post(
        "/ada/v1/projects", headers={"x-ada-token": "foobar"}, json=project_data
    )
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == project_data["name"]
    assert "id" in data

    # Verify the project was actually created in the database
    result = await async_session_test.execute(
        select(Project).where(Project.name == project_data["name"])
    )
    created_project = result.scalar_one_or_none()
    assert created_project is not None
    assert str(created_project.organization_id) == project_data["organization_id"]


@pytest.mark.asyncio
async def test_list_projects(client: TestClient, async_session_test: AsyncSession):
    # First, ensure we have an OrganizationReference and a Project in the database
    org_ref = OrganizationReference(
        id=UUID("2320a0d6-8cbb-4727-8f33-6573d017d980"), name="Test Org 1"
    )
    async_session_test.add(org_ref)

    project = Project(name="Test Project", organization_id=org_ref.id)
    async_session_test.add(project)

    # Also add an APIToken for authentication
    api_token = APIToken(
        token="foobar", user_id=UUID("00000000-0000-0000-0000-000000000000")
    )
    async_session_test.add(api_token)

    await async_session_test.commit()

    response = client.get("/ada/v1/projects", headers={"x-ada-token": "foobar"})
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    assert data[0]["name"] == "Test Project"
    assert data[0]["organization_id"] == str(org_ref.id)


# You can add more tests here for update and delete operations
