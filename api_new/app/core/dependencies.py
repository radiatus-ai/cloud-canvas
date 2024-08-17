from typing import Optional

import httpx
from fastapi import Depends, HTTPException, Request
from opentelemetry import trace
from opentelemetry.trace.propagation.tracecontext import TraceContextTextMapPropagator
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.logger import get_logger
from app.crud.org import organization_reference as crud_org_ref
from app.db.session import get_db

logger = get_logger(__name__)


async def get_trace_context(request: Request) -> Optional[trace.SpanContext]:
    carrier = {}
    for key, value in request.headers.items():
        carrier[key.lower()] = value

    ctx = TraceContextTextMapPropagator().extract(carrier=carrier)
    span = trace.get_current_span(ctx)
    return span.get_span_context() if span else None


async def get_current_user(request: Request):
    token = request.headers.get("Authorization")
    if not token:
        raise HTTPException(status_code=401, detail="No authorization token provided")

    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{settings.AUTH_SERVICE_URL}/api/verify-token",
            json={"token": token.split()[1]},  # Assuming 'Bearer' token
        )

    if response.status_code != 200:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    user = response.json()["user"]
    user["organization_id"] = "21f2a147-212d-415a-b34f-e3ab4bce1d76"

    return user


async def get_db_and_current_user(
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
    trace_context: Optional[trace.SpanContext] = Depends(get_trace_context),
):
    # default_project = await initialize_user_session(db, current_user)
    # Ensure organization reference exists
    org_ref = await crud_org_ref.get_or_create(
        db,
        id=UUID(current_user["organization_id"]),
        name="Default Organization",  # You might want to get this from the user data
    )

    # Get or create default project
    default_project = await crud_project.get_or_create_default(
        db, organization_id=org_ref.id
    )

    return {
        "db": db,
        "current_user": current_user,
        "trace_context": trace_context,
        "default_project": default_project,
        "organization_id": org_ref,
    }


from uuid import UUID

from sqlalchemy import update
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.models.project import Project


async def create_default_project(db: AsyncSession, organization_id: UUID) -> Project:
    # Create a new default project
    new_project = Project(
        name="Default Project", is_user_default=True, organization_id=organization_id
    )
    db.add(new_project)
    await db.flush()  # This assigns an ID to new_project

    # Update any existing default projects
    await db.execute(
        update(Project)
        .where(Project.organization_id == organization_id, Project.id != new_project.id)
        .values(is_user_default=False)
    )

    await db.commit()
    await db.refresh(new_project)

    return new_project


from app.crud.project import project as crud_project
from app.models.organization import OrganizationReference


async def ensure_organization_reference(
    db: AsyncSession,
    organization_id: UUID,
    organization_name: str = "Default Organization",
):
    # Check if the organization reference exists
    stmt = select(OrganizationReference).where(
        OrganizationReference.id == organization_id
    )
    result = await db.execute(stmt)
    org_ref = result.scalar_one_or_none()

    if not org_ref:
        # If it doesn't exist, create it
        org_ref = OrganizationReference(id=organization_id, name=organization_name)
        db.add(org_ref)
        await db.commit()

    return org_ref


async def initialize_user_session(db: AsyncSession, user_data: dict):
    # Ensure organization reference exists
    org_ref = await ensure_organization_reference(
        db, UUID(user_data["organization_id"])
    )

    # Check if the user already has a default project
    stmt = select(Project).where(
        Project.organization_id == org_ref.id, Project.is_user_default == True
    )
    result = await db.execute(stmt)
    default_project = result.scalar_one_or_none()

    if not default_project:
        # If no default project exists, create one
        default_project = Project(
            name="Default Project", is_user_default=True, organization_id=org_ref.id
        )
        db.add(default_project)
        await db.commit()

    return default_project
