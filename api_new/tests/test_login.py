import pytest
from fastapi.testclient import TestClient


@pytest.mark.asyncio
async def test_login(client: TestClient):
    user = response = client.post("/auth/create")
    print(response)
    assert response.status_code == 200
    data = response.json()
    # assert data == {"foo":"bar"}
    print("RESPONDED" * 20)
    # assert data["name"] == project_data["name"]
    # assert "id" in data

    response = client.get("/ada/v1/projects", headers={"x-ada-token": "foobar"})
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    default_project = None
    for x in data:
        print(x)
        if x.get("is_user_default") == True:
            default_project = x
            break
    assert default_project is not None
