from typing import Optional

from pydantic import UUID4, BaseModel


class ChatMessageBase(BaseModel):
    role: str
    content: str
    is_context_file: bool = False
    model: str
    tokens: int
    content_raw: dict
    is_tool_message: bool = False
    chat_id: UUID4


class ChatMessageCreate(ChatMessageBase):
    pass


class ChatMessageUpdate(BaseModel):
    role: Optional[str] = None
    content: Optional[str] = None
    is_context_file: Optional[bool] = None
    model: Optional[str] = None
    tokens: Optional[int] = None
    content_raw: Optional[dict] = None
    is_tool_message: Optional[bool] = None


class ChatMessage(ChatMessageBase):
    id: UUID4

    class Config:
        from_attributes = True
