from platform.api.app.models.organization_old import Organization
from uuid import UUID

import pytest
from sqlalchemy.future import select

from app.crud.project import project as crud_project
from app.schemas.project import ProjectCreate


@pytest.mark.asyncio
async def test_create_project(async_session_test):
    result = await async_session_test.execute(select(Organization))
    organizations = result.scalars().all()
    org = organizations[0]

    obj_in = ProjectCreate(
        name="ui work", is_user_default=False, organization_id=org.id
    )

    project = await crud_project.create_project(
        async_session_test, obj_in=obj_in, auto_commit=False
    )

    assert project.id is not None
    assert isinstance(project.id, UUID)
    assert project.name == obj_in.name
