from uuid import UUID

import pytest

from app.crud.project import project as crud_project
from app.models.organization_reference import OrganizationReference
from app.schemas.project import ProjectCreate


@pytest.mark.asyncio
async def test_create_project(async_session_test):
    # Create an OrganizationReference instead of using Organization
    org_ref = OrganizationReference(
        id=UUID("2320a0d6-8cbb-4727-8f33-6573d017d980"), name="Test Org"
    )
    async_session_test.add(org_ref)
    await async_session_test.flush()

    obj_in = ProjectCreate(
        name="ui work", is_user_default=False, organization_id=org_ref.id
    )

    project = await crud_project.create_project(
        async_session_test, obj_in=obj_in, auto_commit=False
    )

    assert project.id is not None
    assert isinstance(project.id, UUID)
    assert project.name == obj_in.name
    assert project.organization_id == org_ref.id
