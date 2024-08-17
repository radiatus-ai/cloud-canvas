import uuid

from sqlalchemy import JSON, Column, Enum, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.db.base_class import Base


class Package(Base):
    __tablename__ = "packages"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, index=True)
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id"))
    type = Column(String)
    deploy_status = Column(
        Enum("NOT_DEPLOYED", "DEPLOYING", "DEPLOYED", "FAILED", name="deploy_status")
    )
    inputs = Column(JSON)
    outputs = Column(JSON)
    output_data = Column(JSON)
    parameters = Column(JSON)
    parameter_data = Column(JSON)

    project = relationship("Project", back_populates="packages")
