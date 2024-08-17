import logging

from abcs.groq import GroqLLM
from abcs.models import StreamingPromptResponse
from agents.base import Base
from prompt.types import PromptResponse

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def prompt(
    prompt: str, search_result, model: str, api_key: str, storage_manager: any
) -> PromptResponse:
    agent = Base(
        client=GroqLLM(
            api_key=api_key,
            model=model,
        ),
        storage_manager=storage_manager,
    )
    response = agent.generate_text(
        prompt=prompt,
    )
    logger.debug(response)
    return response


async def prompt_stream(
    prompt: str, search_result, model: str, api_key: str, storage_manager=None
) -> StreamingPromptResponse:
    agent = Base(
        client=GroqLLM(
            api_key=api_key,
            model=model,
        ),
        storage_manager=storage_manager,
    )

    try:
        streaming_response = await agent.generate_text_stream(
            prompt=prompt,
        )
        logger.info("Streaming response initiated")
        logger.debug(f"Streaming response type: {type(streaming_response)}")
        return streaming_response
    except Exception as e:
        logger.exception(f"Error in prompt_stream: {e}")
        raise
