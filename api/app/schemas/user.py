from typing import Optional

from pydantic import UUID4, BaseModel, EmailStr


class UserBase(BaseModel):
    email: EmailStr
    google_id: str


class UserCreate(UserBase):
    pass


class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    google_id: Optional[str] = None


class User(UserBase):
    id: UUID4
    organization_id: Optional[UUID4] = None

    class Config:
        from_attributes = True
