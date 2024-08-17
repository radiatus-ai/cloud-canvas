import logging

from abcs.google_gemini import GeminiLLM
from agents.base import Base
from prompt.types import PromptResponse

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def prompt(prompt, search_result, model, api_key, storage_manager) -> PromptResponse:
    agent = Base(
        client=GeminiLLM(
            api_key=api_key,
            model=model,
        ),
        storage_manager=storage_manager,
    )
    # todo: add token count estimates to GeminiLLM
    response = agent.generate_text(
        prompt=prompt,
    )
    logger.debug(response)
    # todo: add token count estimates to GeminiLLM
    # return agent.translate_response(response, 0, 0)
    return response
