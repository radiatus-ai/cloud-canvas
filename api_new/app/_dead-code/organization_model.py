# app/models/organization.py

import uuid

from sqlalchemy import Boolean, Column, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.db.base_class import Base


class Organization(Base):
    __tablename__ = "organizations"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, index=True)
    is_user_default = Column(Boolean, default=False)
    user_organizations = relationship("UserOrganization", back_populates="organization")
    users = relationship(
        "User",
        secondary="user_organization",
        back_populates="organizations",
        viewonly=True,
    )
    projects = relationship("Project", back_populates="organization")
    credentials = relationship("Credential", back_populates="organization")
