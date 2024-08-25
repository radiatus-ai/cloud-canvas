import uuid

from sqlalchemy import Column, ForeignKey, String, Table
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.db.base_class import Base

# New association table
project_credential = Table(
    "project_credential",
    Base.metadata,
    Column("project_id", UUID(as_uuid=True), ForeignKey("projects.id")),
    Column("credential_id", UUID(as_uuid=True), ForeignKey("credentials.id")),
)


class Project(Base):
    __tablename__ = "projects"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, index=True)
    organization_id = Column(
        UUID(as_uuid=True), ForeignKey("organization_references.id")
    )
    user_id = Column(UUID(as_uuid=True), ForeignKey("user_references.id"))

    organization = relationship("OrganizationReference", back_populates="projects")
    user = relationship("UserReference", back_populates="projects")
    packages = relationship("ProjectPackage", back_populates="project")
    connections = relationship("Connection", back_populates="project")
    credentials = relationship(
        "Credential", secondary=project_credential, back_populates="projects"
    )
