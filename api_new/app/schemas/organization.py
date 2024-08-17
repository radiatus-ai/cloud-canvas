from pydantic import UUID4, BaseModel


class OrganizationReferenceBase(BaseModel):
    name: str


class OrganizationReferenceCreate(OrganizationReferenceBase):
    id: UUID4


class OrganizationReferenceUpdate(OrganizationReferenceBase):
    pass


class OrganizationReferenceInDBBase(OrganizationReferenceBase):
    id: UUID4

    class Config:
        orm_mode = True


class OrganizationReference(OrganizationReferenceInDBBase):
    pass


class OrganizationReferenceInDB(OrganizationReferenceInDBBase):
    pass
