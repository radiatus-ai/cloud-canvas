from datetime import datetime
from typing import Optional

from pydantic import UUID4, BaseModel


class APITokenBase(BaseModel):
    name: str


class APITokenCreate(APITokenBase):
    pass


class APIToken(APITokenBase):
    id: UUID4
    token: str
    user_id: UUID4
    created_at: datetime
    last_used_at: Optional[datetime]

    class Config:
        from_attributes = True
