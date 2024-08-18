import pytest
import pytest_asyncio
from fastapi.testclient import TestClient

from app.db.session import get_db
from app.main import app

from .test_db import TestingSessionLocal, init_test_db, override_get_db


@pytest_asyncio.fixture(scope="session")
def client():
    app.dependency_overrides[get_db] = override_get_db
    yield TestClient(app)


@pytest_asyncio.fixture(scope="session", autouse=True)
async def setup_test_db():
    print("Initializing test database...")
    await init_test_db()
    print("Test database initialized.")
    yield
    # Clean up (if needed)


@pytest.fixture(scope="function")
async def db_session():
    async with TestingSessionLocal() as session:
        yield session
        await session.rollback()


@pytest_asyncio.fixture(scope="function")
async def async_session_test():
    async with TestingSessionLocal() as session:
        yield session
        await session.rollback()
