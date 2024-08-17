from typing import Optional

from pydantic import UUID4, BaseModel


class ChatBase(BaseModel):
    name: str
    model: str
    is_user_default: bool = False
    is_starred: bool = False


class ChatCreate(ChatBase):
    pass


class ChatUpdate(BaseModel):
    name: Optional[str] = None
    model: Optional[str] = None


class Chat(ChatBase):
    id: UUID4
    project_id: UUID4

    class Config:
        from_attributes = True
