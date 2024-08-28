import uuid

from sqlalchemy import Column, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.db.base_class import Base


class Connection(Base):
    __tablename__ = "connections"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id"))
    source_package_id = Column(UUID(as_uuid=True), ForeignKey("project_packages.id"))
    target_package_id = Column(UUID(as_uuid=True), ForeignKey("project_packages.id"))
    source_handle = Column(String)
    target_handle = Column(String)

    project = relationship("Project", back_populates="connections")
    # source_package = relationship("Package", foreign_keys=[source_package_id])
    # target_package = relationship("Package", foreign_keys=[target_package_id])
    source_package = relationship("ProjectPackage", foreign_keys=[source_package_id])
    target_package = relationship("ProjectPackage", foreign_keys=[target_package_id])
