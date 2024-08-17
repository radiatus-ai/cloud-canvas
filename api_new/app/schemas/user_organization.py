from pydantic import UUID4, BaseModel


class UserOrganizationBase(BaseModel):
    organization_id: UUID4
    user_id: UUID4


class UserOrganizationCreate(UserOrganizationBase):
    pass


class UserOrganizationUpdate(UserOrganizationBase):
    pass


class UserOrganization(UserOrganizationBase):
    id: UUID4

    class Config:
        from_attributes = True
