import asyncio
from platform.api.app.models.organization_old import Organization

from app.db.session import SessionLocal
from app.models.user import User


async def seed_db():
    async with SessionLocal() as db:
        # Create organization
        org = Organization(name="Sample Organization")
        db.add(org)
        await db.commit()
        await db.refresh(org)

        # Create user
        user = User(
            email="user@example.com",
            google_id="sample_google_id_12345",  # This would typically be provided by Google
            organization_id=org.id,
        )
        db.add(user)
        await db.commit()

        print(f"Created organization: {org.name}")
        print(f"Created user: {user.email}")


if __name__ == "__main__":
    asyncio.run(seed_db())
