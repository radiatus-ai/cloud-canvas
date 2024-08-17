from typing import List

from fastapi import APIRouter, Body, Depends, HTTPException, Request
from opentelemetry import trace
from pydantic import UUID4

from app.core.dependencies import get_db_and_current_user
from app.core.logger import get_logger
from app.crud.chat import chat as crud_chat
from app.crud.project import project as crud_project

# from app.crud.user import user as crud_user
from app.schemas.chat import Chat, ChatCreate
from app.schemas.project import ProjectCreate

logger = get_logger(__name__)

router = APIRouter(
    prefix="/projects",
    tags=["projects"],
)


@router.get("")
async def list_projects(
    request: Request,
    skip: int = 0,
    limit: int = 100,
    deps: dict = Depends(get_db_and_current_user),
):
    db = deps["db"]
    current_user = deps["current_user"]
    trace_context = request.state.trace_context

    tracer = trace.get_tracer(__name__)

    if trace_context:
        logger.info(
            f"Trace context found: TraceId={trace_context.trace_id:032x}, SpanId={trace_context.span_id:016x}"
        )
        with tracer.start_as_current_span(
            "list_projects",
            context=trace.set_span_in_context(trace.NonRecordingSpan(trace_context)),
        ) as span:
            span.set_attribute("user.id", str(current_user.id))
            span.set_attribute("skip", skip)
            span.set_attribute("limit", limit)

            projects = await crud_project.list_projects_for_user(
                db, user=current_user, skip=skip, limit=limit
            )

            span.set_attribute("projects.count", len(projects))
    else:
        logger.info("No trace context found, starting new trace")
        with tracer.start_as_current_span("list_projects") as span:
            span.set_attribute("user.id", str(current_user.id))
            span.set_attribute("skip", skip)
            span.set_attribute("limit", limit)

            projects = await crud_project.list_projects_for_user(
                db, user=current_user, skip=skip, limit=limit
            )

            span.set_attribute("projects.count", len(projects))

    return projects


@router.post("")
async def create(
    body: ProjectCreate = Body(...), deps: dict = Depends(get_db_and_current_user)
):
    db = deps["db"]
    current_user = deps["current_user"]
    # default_org = await crud_user.get_default_organization(db, user_id=current_user.id)
    default_org = "foobar"
    # TODO: replace with _current_ user organization
    project_in = ProjectCreate(name=body.name, organization_id=default_org.id)
    project = await crud_project.create_project(
        db, obj_in=project_in, auto_commit=False
    )
    logger.info("creating project\n" * 10)
    logger.info(f"project is ${project}")
    return project


@router.post("/{project_id}/chats", response_model=Chat)
async def create_chat(
    project_id: UUID4,
    chat_in: ChatCreate,
    deps: dict = Depends(get_db_and_current_user),
):
    db = deps["db"]
    current_user = deps["current_user"]
    project = await crud_project.get(db, id=project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    # todo: shore up security layer
    # if project.organization_id != current_user.organization_id:
    #     raise HTTPException(status_code=403, detail="Not enough permissions")
    chat = await crud_chat.create_chat(db, obj_in=chat_in, project_id=project_id)
    await db.refresh(chat)
    logger.info("after chat")
    return chat


@router.get("/{project_id}/chats", response_model=List[Chat])
async def read_chats(
    project_id: UUID4,
    skip: int = 0,
    limit: int = 100,
    deps: dict = Depends(get_db_and_current_user),
):
    db = deps["db"]
    current_user = deps["current_user"]
    project = await crud_project.get(db, id=project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    # if project.organization_id != current_user.organization_id:
    #     raise HTTPException(status_code=403, detail="Not enough permissions")
    chats = await crud_chat.get_chats_for_project(
        db, project_id=project_id, skip=skip, limit=limit
    )
    return chats
