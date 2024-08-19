from typing import Optional
from uuid import UUID

import httpx
from fastapi import Depends, HTTPException, Request
from opentelemetry import trace
from opentelemetry.trace.propagation.tracecontext import TraceContextTextMapPropagator
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.core.config import settings
from app.core.logger import get_logger
from app.db.session import get_db
from app.models.organization_reference import OrganizationReference

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
    user["organization_id"] = "2320a0d6-8cbb-4727-8f33-6573d017d980"

    return user


async def get_db_and_current_user(
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
    trace_context: Optional[trace.SpanContext] = Depends(get_trace_context),
):
    org_ref = await ensure_organization_reference(
        db, UUID(current_user["organization_id"])
    )

    return {
        "db": db,
        "current_user": current_user,
        "trace_context": trace_context,
        "organization_id": org_ref,
    }


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
