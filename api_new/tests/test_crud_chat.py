from uuid import UUID

import pytest
from sqlalchemy.future import select

from app.crud.chat import chat as crud_chat
from app.models.project import Project
from app.schemas.chat import ChatCreate


@pytest.mark.asyncio
async def test_create_chat(async_session_test):
    result = await async_session_test.execute(select(Project))
    projects = result.scalars().all()
    project = projects[0]

    obj_in = ChatCreate(
        name="api tests",
        model="things",
    )

    model = await crud_chat.create_chat(
        async_session_test, obj_in=obj_in, project_id=project.id
    )

    assert model.id is not None
    assert isinstance(model.id, UUID)
    assert model.name == obj_in.name
