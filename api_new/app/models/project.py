import uuid

from sqlalchemy import Boolean, Column, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.db.base_class import Base


class Project(Base):
    __tablename__ = "projects"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, index=True)
    is_user_default = Column(Boolean, default=False)
    organization_id = Column(
        UUID(as_uuid=True), ForeignKey("organization_references.id")
    )
    organization = relationship("OrganizationReference")
    chats = relationship("Chat", back_populates="project")
