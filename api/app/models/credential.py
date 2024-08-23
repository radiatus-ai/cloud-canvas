import uuid
from enum import Enum

from sqlalchemy import Column, ForeignKey, String
from sqlalchemy import Enum as SQLAlchemyEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.db.base_class import Base


class CredentialType(Enum):
    SERVICE_ACCOUNT_KEY = "SERVICE_ACCOUNT_KEY"
    SECRET = "SECRET"


class Credential(Base):
    __tablename__ = "credentials"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    organization_id = Column(
        UUID(as_uuid=True), ForeignKey("organization_references.id")
    )
    credential_type = Column(SQLAlchemyEnum(CredentialType), nullable=False)
    credential_value = Column(String, nullable=False)  # This will need encryption later

    organization = relationship("OrganizationReference", back_populates="credentials")
