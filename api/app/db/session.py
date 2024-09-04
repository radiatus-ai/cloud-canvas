# app/db/session.py

from sqlalchemy import create_engine
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

from app.core.config import settings

# Async engine and session with pool configuration
async_engine = create_async_engine(
    settings.SQLALCHEMY_DATABASE_URI_ASYNC,
    pool_pre_ping=True,
    pool_size=20,  # Increased from default 5
    max_overflow=10,
    pool_timeout=30,
)
AsyncSessionLocal = sessionmaker(
    autocommit=False, autoflush=False, bind=async_engine, class_=AsyncSession
)

# Sync engine and session (for Alembic) with pool configuration
sync_engine = create_engine(
    settings.SQLALCHEMY_DATABASE_URI,
    pool_pre_ping=True,
    pool_size=20,  # Increased from default 5
    max_overflow=10,
    pool_timeout=30,
)
SyncSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=sync_engine)


async def get_db() -> AsyncSession:
    async with AsyncSessionLocal() as session:
        yield session


def get_sync_db():
    db = SyncSessionLocal()
    try:
        yield db
    finally:
        db.close()