import pytest
from fastapi.testclient import TestClient


@pytest.mark.asyncio
async def test_create_chat(client: TestClient):
    project_data = {"name": "New Test Project", "model": "foobar", "project_id": 1}
    response = client.post(
        "/ada/v1/projects/1/chats", headers={"x-ada-token": "foobar"}, json=project_data
    )
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == project_data["name"]
    assert "id" in data


@pytest.mark.asyncio
async def test_list_chats(client: TestClient):
    response = client.get("/ada/v1/projects/1/chats", headers={"x-ada-token": "foobar"})
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
