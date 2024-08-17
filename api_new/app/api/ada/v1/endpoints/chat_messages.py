import os
from types import SimpleNamespace
from typing import Any

from abcs.models import StreamingPromptResponse
from fastapi import APIRouter, Body, Depends, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import UUID4, BaseModel

from app.core.dependencies import get_db_and_current_user
from app.core.logger import get_logger
from app.crud.chat import chat as crud_chat
from app.crud.chat_message import chat_message as crud_chat_message
from app.crud.project import project as crud_project
from app.db.storage_manager import (
    PostgresStorage,
)
from app.prompt.chatgpt import prompt as prompt_chatgpt
from app.prompt.claude import prompt as prompt_claude
from app.prompt.claude import prompt_stream as prompt_claude_stream
from app.prompt.cohere import prompt as prompt_cohere
from app.prompt.gemini import prompt as prompt_gemini
from app.prompt.groq import prompt as prompt_groq
from app.prompt.ollama import prompt as prompt_ollama
from app.prompt.perplexity import prompt as prompt_perplexity
from app.prompt.types import PromptResponse, UsageStats
from app.schemas.chat_message import ChatMessage, ChatMessageUpdate

# from db.chats import (
#     create_chat,
#     read_project_chats,
# )


class PostQuery(BaseModel):
    prompt: str
    # provider: str
    chatId: UUID4
    # providerModel: str


class UsageStats(BaseModel):
    input_tokens: int
    output_tokens: int
    extra: object


class PromptResponse(BaseModel):
    content: str
    error: object
    raw_response: Any = {}
    usage: UsageStats


class OllamaMessage(BaseModel):
    role: str
    content: str


class OllamaResponse(BaseModel):
    model: str
    created_at: str
    message: OllamaMessage
    done: bool
    total_duration: int
    load_duration: int
    prompt_eval_count: int
    prompt_eval_duration: int
    eval_count: int
    eval_duration: int


logger = get_logger(__name__)


router = APIRouter(
    prefix="/messages",
    tags=["messages"],
)


@router.put("/{message_id}", response_model=ChatMessage)
async def update_chat_message(
    # project_id: UUID4,
    chat_id: UUID4,
    message_id: UUID4,
    message_in: ChatMessageUpdate,
    deps: dict = Depends(get_db_and_current_user),
):
    db = deps["db"]
    current_user = deps["current_user"]
    chat = await crud_chat.get(db, id=chat_id)
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    # project = await crud_project.get(db, id=chat.project_id)
    # if project.organization_id != current_user.organization_id:
    #     raise HTTPException(status_code=403, detail="Not enough permissions")
    message = await crud_chat_message.get(db, id=message_id)
    if not message or message.chat_id != chat_id:
        raise HTTPException(status_code=404, detail="Message not found")
    message = await crud_chat_message.update(db, db_obj=message, obj_in=message_in)
    return message


@router.delete("/{message_id}", response_model=ChatMessage)
async def delete_chat_message(
    project_id: UUID4,
    chat_id: UUID4,
    message_id: UUID4,
    deps: dict = Depends(get_db_and_current_user),
):
    db = deps["db"]
    current_user = deps["current_user"]
    chat = await crud_chat.get(db, id=chat_id)
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    project = await crud_project.get(db, id=chat.project_id)
    if project.organization_id != current_user.organization_id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    message = await crud_chat_message.get(db, id=message_id)
    if not message or message.chat_id != chat_id:
        raise HTTPException(status_code=404, detail="Message not found")
    message = await crud_chat_message.delete_message(db, id=message_id)
    return message


# router = APIRouter(
#     prefix='/prompt',
#     tags = ['prompts'],
#     dependencies=[Depends(verify_token)]
# )


# query vector db + LLM
@router.post("/prompt")
async def prompt(
    body: PostQuery = Body(...),
    deps: dict = Depends(get_db_and_current_user),
):
    db = deps["db"]
    response = await handle_prompt(db, body.prompt, body.chatId)
    # hack. the raw response is the response from the provider
    # useful for debugging but can't be serialized well, so we chop it off here
    if response.raw_response:
        response.raw_response = ""
    return {"response": response}


@router.post("/stream")
async def prompt(
    body: PostQuery = Body(...),
    deps: dict = Depends(get_db_and_current_user),
):
    db = deps["db"]
    response = await handle_prompt_stream(db, body.prompt, body.chatId)
    # hack. the raw response is the response from the provider
    # useful for debugging but can't be serialized well, so we chop it off here
    # if response.raw_response:
    #     response.raw_response = ""
    return response


# todo: maybe push to storage manager since it expects this interface
def chats_to_messages(chats):
    # todo: use chat message crud
    # chats = read_project_chats(project_id)
    messages = []
    for chat in chats:
        # if chat.content_raw:
        #     messages.append(chat.content_raw)
        # else:
        # TODO: bring back content raw ^
        messages.append(
            {
                "role": chat.role,
                "content": chat.content,
            }
        )
    logger.debug("messages")
    logger.debug(messages)
    return messages


async def get_past_messages(db, chat_id):
    messages = await crud_chat_message.get_messages_for_chat(
        db,
        chat_id=chat_id,
    )
    msgs = chats_to_messages(messages)
    # mapped = []
    # for msg in msgs:
    #     pydantic_chat_message = parse_obj_as(ChatMessage, msg.__dict__)
    #     mapped.append(pydantic_chat_message.dict())
    return msgs


async def store_message(db, role, message, chat_id, provider, provider_model):
    # msg_in = {
    #     'role': role
    # }
    msg_in = dict(
        role=role,
        content=message,
        chat_id=chat_id,
        provider=provider,
        model=provider_model,
        usage=None,
        tokens=0,
        is_context_file=False,
        content_raw={"content": "raw"},
        is_tool_message=False,
    )
    # msg_in['role'] = role
    # msg_in['message'] = message
    # msg_in['project_id'] = project_id
    # msg_in['provider'] = provider
    # msg_in['provider_model'] = provider_model
    # msg_in['usage'] = None
    # msg_in['is_context_file'] = False
    logger.info("info\n" * 20)
    logger.info(msg_in)
    # logger.info(msg_in.role)
    logger.info("endinfo\n" * 20)
    chat_message = await crud_chat_message.create_message(
        db=db, obj_in=SimpleNamespace(**msg_in), chat_id=chat_id
    )
    return chat_message


async def remove_last_message(db, chat_id):
    messages = await crud_chat_message.get_messages_for_chat(
        db,
        chat_id=chat_id,
    )
    msgs = chats_to_messages(messages)
    last_message = msgs[-1]
    logger.info("REMOVE LAST\n" * 20)
    # await crud_chat_message.delete_message(db, id=last_message.id)
    # mapped = []
    # for msg in msgs:
    #     pydantic_chat_message = parse_obj_as(ChatMessage, msg.__dict__)
    #     mapped.append(pydantic_chat_message.dict())
    # return msgs


# todo: you can technically switch models every request but the side effects are unknown.
# def handle_prompt(prompt: str, provider: str, project_id: str, providerModel: str) -> PromptResponse:
async def handle_prompt(db, prompt: str, chat_id: str) -> PromptResponse:
    # 1. search for relevant documents.
    # for smaller datasets like codebases, it might make sense to pass
    # all documents at once, every time.
    # search_result = ' '.join(vector_search(prompt))
    # skip vector search since we aren't using it downstream. also, need to migrate to sqlalchamy vector
    search_result = " "
    response = PromptResponse(
        content="",
        error={},
        usage=UsageStats(input_tokens=0, output_tokens=0, extra={}),
    )
    logger.info("handling prompt\n" * 20)

    # 2. fetch project => chat for model config
    # project = read_project(project_id)
    # provider = project.provider
    # provider_model = project.provider_model
    provider = "anthropic"
    provider_model = "claude-3-5-sonnet-20240620"

    storage_manager = PostgresStorage()
    storage_manager.set_get_past_messages_callback(
        lambda: get_past_messages(db, chat_id=chat_id)
    )
    storage_manager.set_store_message_callback(
        lambda role, message: store_message(
            db, role, message, chat_id, provider, provider_model
        )
    )
    # storage_manager.set_store_raw_callback(
    #     lambda message: create_chat(
    #         message.role,
    #         message.content,
    #         project_id,
    #         provider,
    #         provider_model,
    #         usage=None,
    #         is_context_file=False,
    #         content_raw=message.content_raw,
    #         is_tool_message=True,
    #     )
    # )
    # # todo: add remove last callback
    storage_manager.set_remove_last_callback(lambda: remove_last_message(db, "1"))

    # # 3. fetch settings for API keys
    # settings = read_organization_settings(1)
    # org = await crud_organization.get(db, id=1)
    # settings = org.settings
    # crud_organization.get(1)

    # 4. pass to LLM
    # todo: detect API rate limits / credit exhaustion
    # print("project")
    # print(project)
    try:
        if provider == "anthropic":
            response = await prompt_claude(
                prompt,
                search_result,
                provider_model,
                # settings.anthropic_api_key,
                os.getenv("ANTHROPIC_API_KEY"),
                storage_manager=storage_manager,
            )
        elif provider == "cohere":
            response = prompt_cohere(
                prompt,
                search_result,
                provider_model,
                settings.cohere_api_key,
                storage_manager=storage_manager,
            )
        elif provider == "google":
            response = prompt_gemini(
                prompt,
                search_result,
                provider_model,
                settings.google_ai_studio_api_key,
                storage_manager=storage_manager,
            )
        elif provider == "groq":
            response = prompt_groq(
                prompt,
                search_result,
                provider_model,
                settings.groq_api_key,
                storage_manager=storage_manager,
            )
        elif provider == "perplexity":
            # just haven't tested the agent with perplexity yet, but it probably works
            past_messages = storage_manager.get_past_messages()
            response = prompt_perplexity(
                prompt,
                search_result,
                past_messages,
                provider_model,
                settings.perplexity_ai_api_key,
                storage_manager=storage_manager,
            )
        elif provider == "ollama":
            response = prompt_ollama(
                prompt,
                search_result,
                provider_model,
                "api-key-dog",
                storage_manager=storage_manager,
            )
        elif provider == "openai":
            response = prompt_chatgpt(
                prompt,
                search_result,
                provider_model,
                settings.open_ai_api_key,
                storage_manager=storage_manager,
            )
        else:
            logger.error(f"Unrecognized provider: {provider}")
            return response
    except Exception as e:
        logger.exception(f"An error occurred while prompting: {e}")
        return PromptResponse(
            content="",
            error={
                # "type": type(e),
                "message": e,
            },
            usage=UsageStats(input_tokens=0, output_tokens=0, extra={}),
        )

    logger.debug("response")
    logger.debug(response)

    return response


# New streaming route
async def handle_prompt_stream(db, prompt: str, chat_id: str):
    # 1. search for relevant documents.
    # for smaller datasets like codebases, it might make sense to pass
    # all documents at once, every time.
    # search_result = ' '.join(vector_search(prompt))
    # skip vector search since we aren't using it downstream. also, need to migrate to sqlalchamy vector
    search_result = " "
    response = PromptResponse(
        content="",
        error={},
        usage=UsageStats(input_tokens=0, output_tokens=0, extra={}),
    )
    logger.info("handling prompt\n" * 20)

    # 2. fetch project => chat for model config
    # project = read_project(project_id)
    # provider = project.provider
    # provider_model = project.provider_model
    provider = "anthropic"
    provider_model = "claude-3-5-sonnet-20240620"

    storage_manager = PostgresStorage()
    storage_manager.set_get_past_messages_callback(
        lambda: get_past_messages(db, chat_id=chat_id)
    )
    storage_manager.set_store_message_callback(
        lambda role, message: store_message(
            db, role, message, chat_id, provider, provider_model
        )
    )
    # storage_manager.set_store_raw_callback(
    #     lambda message: create_chat(
    #         message.role,
    #         message.content,
    #         project_id,
    #         provider,
    #         provider_model,
    #         usage=None,
    #         is_context_file=False,
    #         content_raw=message.content_raw,
    #         is_tool_message=True,
    #     )
    # )
    # # todo: add remove last callback
    storage_manager.set_remove_last_callback(lambda: remove_last_message(db, "1"))

    # settings = read_organization_settings(1)
    print("PROVIDER" * 30)
    print(provider)
    print(provider_model)

    async def event_generator():
        try:
            streaming_response = None
            if provider == "anthropic":
                streaming_response = await prompt_claude_stream(
                    prompt,
                    "",
                    provider_model,
                    os.getenv("ANTHROPIC_API_KEY"),
                    storage_manager=storage_manager,
                )
            elif provider == "cohere":
                streaming_response = await prompt_cohere_stream(
                    prompt,
                    "",
                    provider_model,
                    settings.cohere_api_key,
                    storage_manager=storage_manager,
                )
            elif provider == "openai":
                streaming_response = await prompt_chatgpt_stream(
                    prompt,
                    "",
                    provider_model,
                    settings.open_ai_api_key,
                    storage_manager=storage_manager,
                )
            elif provider == "groq":
                streaming_response = await prompt_groq_stream(
                    prompt,
                    "",
                    provider_model,
                    settings.groq_api_key,
                    storage_manager=storage_manager,
                )
            elif provider == "ollama":
                streaming_response = await prompt_ollama_stream(
                    prompt,
                    "",
                    provider_model,
                    "api-key-dog",
                    storage_manager=storage_manager,
                )
            else:
                logger.error(f"Unsupported provider: {provider}")
                yield f"data: Error: Unsupported provider: {provider}\n\n"
                yield "data: [DONE]\n\n"
                return
            logger.info("STREAM\n" * 40)
            logger.info(streaming_response)
            logger.info(streaming_response.content)

            if streaming_response is None:
                logger.error("Streaming response is None")
                yield "data: Error: Failed to get streaming response\n\n"
                yield "data: [DONE]\n\n"
                return

            if not isinstance(streaming_response, StreamingPromptResponse):
                logger.error(f"Invalid response type: {type(streaming_response)}")
                yield f"data: Error: Invalid response type: {type(streaming_response)}\n\n"
                yield "data: [DONE]\n\n"
                return

            message_parts = []
            async for chunk in streaming_response.content:
                # logger.info("here it is")
                # logger.info(chunk)
                message_parts.append(chunk)
                yield f"data: {chunk}\n\n"
            if storage_manager is not None:
                try:
                    # translated = self._translate_response(response)
                    await storage_manager.store_message(
                        "assistant", "".join(message_parts)
                    )
                except Exception as e:
                    logger.error("Error storing messages: %s", e, exc_info=True)
                    raise e
            yield "data: [DONE]\n\n"

        except Exception as e:
            logger.exception(f"An error occurred while streaming: {e}")
            yield f"data: Error: {str(e)}\n\n"
            yield "data: [DONE]\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")
