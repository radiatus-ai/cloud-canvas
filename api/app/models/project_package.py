import uuid
from enum import Enum

from sqlalchemy import JSON, Column, ForeignKey, String
from sqlalchemy import Enum as SQLAlchemyEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.db.base_class import Base


class ProjectPackageStatus(Enum):
    NOT_DEPLOYED = "NOT_DEPLOYED"
    DEPLOYING = "DEPLOYING"
    DESTROYING = "DESTROYING"
    DEPLOYED = "DEPLOYED"
    FAILED = "FAILED"


class ProjectPackage(Base):
    __tablename__ = "project_packages"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, index=True)
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id"))
    type = Column(String)
    deploy_status = Column(SQLAlchemyEnum(ProjectPackageStatus), nullable=False)
    inputs = Column(JSON)
    outputs = Column(JSON)
    output_data = Column(JSON)
    parameters = Column(JSON)
    parameter_data = Column(JSON)

    project = relationship("Project", back_populates="packages")
