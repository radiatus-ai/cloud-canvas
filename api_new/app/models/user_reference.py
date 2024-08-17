import uuid

from sqlalchemy import Column, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.db.base_class import Base


class UserReference(Base):
    __tablename__ = "user_references"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, index=True)
    google_id = Column(String, unique=True, index=True)

    api_tokens = relationship("APIToken", back_populates="user")
    projects = relationship("Project", back_populates="user")
