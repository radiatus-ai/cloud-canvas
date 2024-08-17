import uuid

from sqlalchemy import JSON, Boolean, Column, ForeignKey, Integer, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.db.base_class import Base


class ChatMessage(Base):
    __tablename__ = "chat_messages"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    role = Column(String)
    content = Column(String)
    is_context_file = Column(Boolean, default=False)
    model = Column(String)
    tokens = Column(Integer, default=0)
    content_raw = Column(JSON)
    is_tool_message = Column(Boolean, default=False)
    chat_id = Column(UUID(as_uuid=True), ForeignKey("chats.id"), nullable=False)
    chat = relationship("Chat", back_populates="chat_messages")
