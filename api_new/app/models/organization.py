from sqlalchemy import Column, String
from sqlalchemy.dialects.postgresql import UUID

from app.db.base_class import Base


class OrganizationReference(Base):
    __tablename__ = "organization_references"
    id = Column(UUID(as_uuid=True), primary_key=True)
    name = Column(String, index=True)
