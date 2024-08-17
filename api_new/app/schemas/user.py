from pydantic import UUID4, BaseModel, EmailStr

# from uuid import UUID


class UserBase(BaseModel):
    email: EmailStr
    google_id: str


class UserCreate(UserBase):
    # having trouble with this in validators
    # organizations: List[UserOrganizationCreate] = []
    pass


class UserUpdate(BaseModel):
    email: EmailStr | None = None
    google_id: str | None = None
    # having trouble with this in validators
    # organizations: List[UserOrganizationUpdate] | None = None


class User(UserBase):
    id: UUID4
    organization_id: UUID4 | None = None
    # having trouble with this in validators
    # organizations: List[UserOrganization] = []

    class Config:
        # json_encoders = {
        #     UUID: str  # This will convert UUID to string during JSON serialization
        # }

        from_attributes = True
