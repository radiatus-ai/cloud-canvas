import asyncio

from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

from alembic import command
from alembic.config import Config
from app.db.base_class import Base
from app.models import (
    APIToken,
    Chat,
    ChatMessage,
    Organization,
    Project,
    User,
    UserOrganization,
)

# Create an async engine for SQLite
TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"
test_engine = create_async_engine(TEST_DATABASE_URL, echo=True)

# Create a sessionmaker
TestingSessionLocal = sessionmaker(
    autocommit=False, autoflush=False, bind=test_engine, class_=AsyncSession
)


def run_migrations():
    alembic_cfg = Config("alembic.ini")
    alembic_cfg.set_main_option("sqlalchemy.url", str(TEST_DATABASE_URL))
    command.upgrade(alembic_cfg, "head")


# Function to create tables and add seed data
async def init_test_db():
    print("Dropping all tables...")
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
    print("All tables dropped.")

    print("Creating all tables...")
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("All tables created.")

    print("Running migrations...")
    await asyncio.to_thread(run_migrations)
    print("Migrations complete.")

    print("Adding seed data...")
    async with TestingSessionLocal() as session:
        # Add seed data
        org1 = Organization(name="Test Org 1", is_user_default=True)
        org2 = Organization(name="Test Org 2", is_user_default=True)
        session.add_all([org1, org2])
        await session.flush()

        user1 = User(
            email="user1@example.com", google_id="google_id_1", organization_id=org1.id
        )
        user2 = User(
            email="user2@example.com", google_id="google_id_2", organization_id=org2.id
        )
        session.add_all([user1, user2])
        await session.flush()

        # Add entries to the UserOrganization model
        user_org1 = UserOrganization(user_id=user1.id, organization_id=org1.id)
        session.add(user_org1)
        await session.flush()

        project1 = Project(name="Test Project 1", organization_id=org1.id)
        project2 = Project(name="Test Project 2", organization_id=org2.id)
        session.add_all([project1, project2])
        await session.flush()

        api_token = APIToken(name="test", token="foobar", user_id=user1.id)
        session.add(api_token)
        await session.flush()

        chat = Chat(name="first chat", model="hello world", project_id=project1.id)
        session.add(chat)
        await session.flush()

        chat_message = ChatMessage(
            role="user",
            content="hello world",
            is_context_file=False,
            model="opus",
            tokens=0,
            content_raw={},
            is_tool_message=False,
            chat_id=chat.id,
        )
        session.add(chat_message)
        await session.flush()

        await session.commit()
    print("Seed data added.")


# Dependency to get DB session
async def override_get_db():
    async with TestingSessionLocal() as session:
        yield session
