# app/models/user.py

import uuid

from sqlalchemy import Column, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.db.base_class import Base


class UserOrganization(Base):
    __tablename__ = "user_organization"
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), primary_key=True)
    organization_id = Column(
        UUID(as_uuid=True), ForeignKey("organizations.id"), primary_key=True
    )
    user = relationship("User", back_populates="user_organizations")
    organization = relationship("Organization", back_populates="user_organizations")


class User(Base):
    __tablename__ = "users"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, index=True)
    google_id = Column(String, unique=True, index=True)
    # dont want this long term,
    organization_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id"))
    # having trouble with this in validators
    user_organizations = relationship("UserOrganization", back_populates="user")
    organizations = relationship(
        "Organization",
        secondary="user_organization",
        back_populates="users",
        viewonly=True,
    )
    api_tokens = relationship("APIToken", back_populates="user")
