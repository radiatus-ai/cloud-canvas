from pydantic import UUID4, BaseModel


# API Token schemas
class APITokenBase(BaseModel):
    token: str


class APITokenCreate(APITokenBase):
    user_id: UUID4


class APIToken(APITokenBase):
    id: UUID4
    user_id: UUID4

    class Config:
        from_attributes = True
