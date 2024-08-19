import uuid

from sqlalchemy import JSON, Column, String
from sqlalchemy.dialects.postgresql import UUID

from app.db.base_class import Base


class Package(Base):
    __tablename__ = "packages"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, index=True)
    type = Column(String)
    inputs = Column(JSON)
    outputs = Column(JSON)
    parameters = Column(JSON)
    # todo: add organization, other fields
    # organization_id = Column(
    #     UUID(as_uuid=True), ForeignKey("organization_references.id")
    # )
