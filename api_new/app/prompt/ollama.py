import logging

from abcs.ollama import OllamaLLM
from agents.base import Base
from prompt.types import PromptResponse

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def prompt(
    prompt: str, search_result, model: str, api_key: str, storage_manager: any
) -> PromptResponse:
    agent = Base(
        client=OllamaLLM(
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
