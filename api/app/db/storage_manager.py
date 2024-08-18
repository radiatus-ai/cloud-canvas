import logging
from typing import Any, Callable, Coroutine

from storage.storage_manager import StorageManager

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)


class PostgresStorage(StorageManager):
    def __init__(self):
        super().__init__()
        self.get_past_messages_callback: Callable[[], Coroutine[Any, Any, list]] = None

    async def store_message(self, role: str, message: str, **kwargs) -> bool:
        if callable(self.store_message_callback):
            await self.store_message_callback(role, message, **kwargs)
        return True

    async def store_raw(self, message: str, **kwargs) -> bool:
        if callable(self.store_raw_callback):
            await self.store_raw_callback(message, **kwargs)
        return True

    async def get_past_messages(self):
        if callable(self.get_past_messages_callback):
            return await self.get_past_messages_callback()
        return []

    async def remove_last(self):
        if callable(self.remove_last_callback):
            await self.remove_last_callback()
        else:
            logger.exception("Need to implement remove_last callback")

    def set_get_past_messages_callback(
        self, callback: Callable[[], Coroutine[Any, Any, list]]
    ):
        self.get_past_messages_callback = callback

    def set_store_message_callback(
        self,
        callback: Callable[
            [
                str,
                str,
            ],
            Coroutine[Any, Any, None],
        ],
    ):
        self.store_message_callback = callback

    def set_store_raw_callback(
        self,
        callback: Callable[
            [
                str,
            ],
            Coroutine[Any, Any, None],
        ],
    ):
        self.store_raw_callback = callback

    def set_remove_last_callback(
        self, callback: Callable[[], Coroutine[Any, Any, None]]
    ):
        self.remove_last_callback = callback
