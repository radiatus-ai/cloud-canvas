import uuid

from sqlalchemy import Boolean, Column, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.db.base_class import Base


class Chat(Base):
    __tablename__ = "chats"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, index=True)
    model = Column(String)
    is_user_default = Column(Boolean, default=False)
    is_starred = Column(Boolean, default=False)
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id"), nullable=False)
    project = relationship("Project", back_populates="chats")
    chat_messages = relationship("ChatMessage", back_populates="chat")
