import logging

from abcs.perplexity import PerplexityLLM
from prompt.types import PromptResponse
from tools.tool_manager import ToolManager

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def prompt(
    prompt: str, search_result, message_history, model: str, api_key: str
) -> PromptResponse:
    tool_manager = ToolManager()
    client = PerplexityLLM(
        api_key=api_key,
        model=model,
        tool_manager=tool_manager,
    )

    response = client.generate_text(
        prompt=prompt, past_messages=message_history, tools=None
    )
    logger.debug(response)
    return response
